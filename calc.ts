import helpers = require('./helpers.js');
import mathjs = require('mathjs');

let log = (x) => console.log(x);
let factorial = (x) => mathjs.factorial(x);

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
    let enumeratedTypes = iterativeFactorial(typesData.types, 5);
    calculateOptimalTypes(<Array<Array<string>>>enumeratedTypes);
}

function calculateOptimalTypes(enumeratedTypes: Array<Array<string>>) {
    console.log('Sorting combinations by max strength / min weakness.', '\n');
    let teamTypes: Array<Array<string>> = [];
    enumeratedTypes.forEach(t => {
        let tempScore = calculateSWScore(t);
        if (teamTypes.length === 0 || tempScore > calculateSWScore(teamTypes[teamTypes.length-1])) {
            if (teamTypes.length < 10) {
                teamTypes.push(t);
            } else {
                teamTypes[9] = t;
            }
            teamTypes.sort((a, b) => calculateSWScore(a) > calculateSWScore(b) ? -1 : 1);
        }
    });

    console.log('Top Ten Teams [Score : Team]');
    teamTypes.forEach((team, i) => console.log(calculateSWScore(team), ':', team));
    console.log('\n');

    let teamStrengths = calculateStrengths(teamTypes[0]);
    let teamWeaknesses = calculateWeaknesses(teamTypes[0]);

    // IF YOU WOULD LIKE TO CALCULATE UNHANDLED STATS FOR A CUSTOM TEAM INSERT THEM HERE AND UN-COMMENT ThESE LINES
    // teamTypes = [['Fire', 'Ground', 'Bug', 'Fairy', 'Fighting', 'Rock', 'Flying']];
    // teamStrengths = calculateStrengths(data, types);

    const unhandledTypes = typesData.types.filter(x => !teamStrengths.find(y => x === y));
    let finishingTouches = {};
    unhandledTypes.forEach(type => {
        finishingTouches[type] = [];
        finishingTouches[type] = typesData.defense_effectiveness_by_type[type]['2x'];
    });

    console.log('Strongest Team Comp:', teamTypes[0], '\n');
    console.log('Strengths:', teamStrengths, '\n');
    console.log('Weaknesses:', teamWeaknesses, '\n');
    console.log('Unhandled Types:', unhandledTypes, '\n');
    console.log('Ways to handle them:', '\n');
    console.log(finishingTouches);
}

// This function can be proven correct for n choose r by the formula (r+n-1)!/(r!*(n-1)!)
function iterativeFactorial<T>(n: Array<T>, r: number): Array<Array<T>> {
    let sets = [];

    let key = [];
    for (let i = 0; i < r; i++) {
        key.push(0);
    }

    let getIterations = (n, r) => factorial(r + n - 1) / (factorial(r) * factorial(n - 1));

    for (let i = 0; i < getIterations(n.length, r); i++) {
        for (let j = r; j >= 0; j--) {
            if (key[j] < j) {
                key[j]++;

                for (let k = j; k < r; k++) {
                    key[k] = key[j];
                }
                break;
            }
        }

        let set = [];
        for (let l = 0; l < key.length; l++) {
            set.push(n[key[l]]);
        }
        sets.push(set);
    }

    return sets;
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