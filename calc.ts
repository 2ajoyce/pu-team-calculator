import helpers = require('./helpers.js');
let log = (x) => console.log(x);

const readJson = helpers.ReadJson;
const readCsv = helpers.ReadCsv;
readJson('./types.json', (err, typesData) => {
    err ? console.log(err) : readJson('./pokemon.json', (err, pokemonData) => {
        err ? console.log(err) : calculateTypesList(typesData, pokemonData);
    });
});
let typesData;
let pokemonData;

function calculateTypesList(types: any, pokemon: any): void {
    typesData = types;
    pokemonData = pokemon;
    // This function can be proven correct by the formula (6+19-1)!/(6!*(19-1)!)
    // trampoline(thunkedFactorialize.bind(
    //     this,
    //     typesData.types,
    //     [0, 0, 0, 0, 0, 0],
    //     calculateOptimalTypes
    // ));
    
    enumerateTypes();
}
function enumerateTypes() {
    log('Enumerating Types');

    log(iterativeFactorialize([1, 2, 3], 2));
}

function iterativeFactorialize<T>(n: Array<T>, r: number): Array<T> {
    let sets = [];
    let iterations = r^r;
    log(iterations);
    for(let i=0; i<iterations; i++) {
        log(i);
    }

    return sets;
}

function calculateOptimalTypes(typesList: Array<Array<string>>) {
    console.log('Sorting combinations by max strength / min weakness.');
    let teamTypes: Array<Array<string>> = [];
    let swScore = [];
    typesList.forEach(t => {
        let tempScore = calculateSWScore(t);
        if (teamTypes.length === 0 || tempScore > swScore[0]) {
            teamTypes.push(t);
            swScore.push(tempScore);
            if(teamTypes.length > 10 && swScore.length > 10) {
                teamTypes = teamTypes.slice(1, 11);
                swScore = swScore.slice(1, 11);
            }
        }
    });
    // teamTypes = teamTypes.slice(teamTypes.length - 11);
    console.log(teamTypes);
    console.log(swScore);
    let teamStrengths = calculateStrengths(teamTypes[teamTypes.length-1]);
    let teamWeaknesses = calculateWeaknesses(teamTypes[teamTypes.length-1]);

    // IF YOU WOULD LIKE TO CALCULATE UNHANDLED STATS FOR A CUSTOM TEAM INSERT THEM HERE AND UN-COMMENT ThESE LINES
    // teamTypes = [['Fire', 'Ground', 'Bug', 'Fairy', 'Fighting', 'Rock', 'Flying']];
    // teamStrengths = calculateStrengths(data, types);

    const unhandledTypes = typesData.types.filter(x => !teamStrengths.find(y => x === y));
    let finishingTouches = {};
    unhandledTypes.forEach(type => {
        finishingTouches[type] = [];
        finishingTouches[type] = typesData.defense_effectiveness_by_type[type]['2x'];
    });

    console.log('Strongest Team Comp:', teamTypes[teamTypes.length]);
    console.log('Strengths:', teamStrengths);
    console.log('Weaknesses:', teamWeaknesses);
    console.log('Unhandled Types:', unhandledTypes);
    console.log('Ways to handle them:');
    console.log(finishingTouches);
}

function thunkedFactorialize(
    items: Array<string>,
    indexes: Array<number>,
    cb: Function
) {
    return factorialize.bind(this, [], items, indexes, cb);
    function factorialize(
        combinations: Array<Array<string>>,
        items: Array<string>,
        indexes: Array<number>,
        cb: Function
    ): Function {
        combinations.push([
            items[indexes[0]],
            items[indexes[1]],
            items[indexes[2]],
            items[indexes[3]],
            items[indexes[4]],
            items[indexes[5]]
        ]);

        let total = ((items.length - 1) * indexes.length);
        if (indexes.reduce((accumulator, currentValue) => accumulator + currentValue) < total) {
            increment(indexes, 0, items.length - 1, false);
            return factorialize.bind(this, combinations, items, indexes, cb);
        } else {
            console.log('Found', combinations.length, 'combinations of 6 types.');
            cb(combinations);
            return null;
        }
    }
}

function trampoline(fn) {
    var op = fn;
    while (op != null && typeof op === 'function') {
        op = op();
    }
}

function increment(indexes: Array<number>, start: number, max: number, rollover: boolean): void {
    if (indexes[start] < max) {
        indexes[start]++;
        if (rollover) {
            for (let i = 0; i < start; i++) {
                indexes[i] = indexes[start];
            }
        }
    } else if (start < indexes.length) {
        increment(indexes, start + 1, max, true);
    }
}

function calculateSWScore(types: Array<string>): number {
    return calculateStrengths(types).length - calculateWeaknesses(types).length;
}

function calculateStrengths(types: Array<string>): Array<string> {
    let strengths = [];
    types.forEach(type => {
        typesData.attack_effectiveness_by_type[type]['2x'].forEach(strength => {
            if (!strengths.find(x => x === strength)) {
                strengths.push(strength);
            }
        });
    });
    return strengths;
}

function calculateWeaknesses(types: Array<string>): Array<string> {
    let strengths = [];
    types.forEach(type => {
        typesData.defense_effectiveness_by_type[type]['2x'].forEach(strength => {
            if (!strengths.find(x => x === strength)) {
                strengths.push(strength);
            }
        });
    });
    return strengths;
}

function sortTypesByFlexibility(data: any): Array<string> {
    return data.types.sort((a, b) => {
        let len = (ele) => {
            return data.attack_effectiveness_by_type[ele]['2x'].length;
        };
        return len(a) > len(b) ? -1 : 1;
    }).slice(0);
}

function sortTypesByDurability(data: any): Array<string> {
    return data.types.sort((a, b) => {
        let len = (ele) => {
            return data.attack_effectiveness_by_type[ele]['0.5x'].length;
        };
        return len(a) < len(b) ? -1 : 1;
    }).slice(0);
}