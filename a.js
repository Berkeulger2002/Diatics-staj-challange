const zoo = document.getElementById('zoo');
const results = document.getElementById('results');
const animals = [];

class Animal {
    constructor(type, speed) {
        this.type = type;
        this.speed = speed;
        this.x = Math.random() * 468;
        this.y = Math.random() * 468;
        this.element = document.createElement('div');
        this.element.classList.add('animal', type);
        zoo.appendChild(this.element);
        this.updatePosition();
    }

    move() {
        const dx = (Math.random() - 0.5) * this.speed * 2;
        const dy = (Math.random() - 0.5) * this.speed * 2;
        this.x = Math.max(0, Math.min(468, this.x + dx));
        this.y = Math.max(0, Math.min(468, this.y + dy));
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}

function createAnimals(count, type, speed) {
    for (let i = 0; i < count; i++) {
        animals.push(new Animal(type, speed));
    }
}

createAnimals(15, 'koyun', 2); 
createAnimals(15, 'koyundisi', 2); 
createAnimals(5, 'inek', 2);
createAnimals(5, 'inekdisi', 2);
createAnimals(10, 'tavuk', 1);
createAnimals(5, 'kurt', 3);
createAnimals(5, 'kurtdisi', 3);
createAnimals(10, 'horoz', 1);
createAnimals(4, 'aslan', 3);
createAnimals(4, 'aslandisi', 3);
createAnimals(1, 'avci', 1);

let steps = 0;

function simulate() {
    steps++;
    animals.forEach(animal => animal.move());
    hunt();
    if (steps < 1000) {
        requestAnimationFrame(simulate);
    } else {
        countAnimals();
    }
}

function hunt() {
    const distances = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    const predatorPreyRules = {
        'kurt': ['koyun', 'koyundisi', 'tavuk', 'horoz', 'inek', 'inekdisi'],
        'kurtdisi': ['koyun', 'koyundisi', 'tavuk', 'horoz', 'inek', 'inekdisi'],
        'aslan': ['koyun','tavuk', 'koyundisi','horoz', 'inek', 'inekdisi', 'kurt', 'kurtdisi'],
        'aslandisi': ['koyun','tavuk','horoz', 'koyundisi', 'inek', 'inekdisi', 'kurt', 'kurtdisi'],
        'avci': ['koyun', 'koyundisi', 'tavuk', 'horoz', 'inek', 'inekdisi', 'kurt', 'kurtdisi', 'aslan', 'aslandisi'],
    };

    animals.forEach(predator => {
        animals.forEach(prey => {
            const distance = distances(predator, prey);
            if (predator !== prey && predatorPreyRules[predator.type]?.includes(prey.type) && distance < 64) {
                console.log(`${predator.type} avladı: ${prey.type}`);
                prey.element.remove();
                animals.splice(animals.indexOf(prey), 1);
            }
        });
    });

    for (let i = 0; i < animals.length; i++) {
        for (let j = i + 1; j < animals.length; j++) {
            const distance = distances(animals[i], animals[j]);
            if (distance < 3) {
                const breedingPairs = [
                    ['koyun', 'koyundisi'],
                    ['inek', 'inekdisi'],
                    ['kurt', 'kurtdisi'],
                    ['aslan', 'aslandisi']
                ];

                breedingPairs.forEach(pair => {
                    if ((animals[i].type === pair[0] && animals[j].type === pair[1]) ||
                        (animals[i].type === pair[1] && animals[j].type === pair[0])) {
                        const newType = Math.random() < 0.5 ? pair[0] : pair[1];
                        createAnimals(1, newType, 2);
                        console.log(`Yeni hayvan doğdu: ${newType}`);
                    }
                });
            }
        }
    }
}

function countAnimals() {
    const counts = {};
    animals.forEach(animal => {
        counts[animal.type] = (counts[animal.type] || 0) + 1;
    });
    results.innerHTML = 'Simülasyon Sonucu:<br>' + Object.entries(counts).map(([key, value]) => `${key}: ${value}`).join('<br>');
}
function breed() {
const distances = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
const breedingPairs = [
['koyun', 'koyundisi'],
['inek', 'inekdisi'],
['kurt', 'kurtdisi'],
['aslan', 'aslandisi']
];

animals.forEach(a => {
animals.forEach(b => {
    if (a !== b && distances(a, b) < 32) {
        breedingPairs.forEach(pair => {
            if ((a.type === pair[0] && b.type === pair[1]) || (a.type === pair[1] && b.type === pair[0])) {
                const newType = Math.random() < 0.5 ? pair[0] : pair[1];
                const newAnimal = new Animal(newType, 2);

                // Yeni hayvanı ebeveynlerin yakınına yerleştir
                newAnimal.x = (a.x + b.x) / 2 + (Math.random() - 0.5) * 30;
                newAnimal.y = (a.y + b.y) / 2 + (Math.random() - 0.5) * 30;
                newAnimal.updatePosition();

                animals.push(newAnimal);
            }
        });
    }
});
});
}

simulate();