exampledata = {
    inputData : '01/01/1980',
    birthdays: [
        {
            type: 'Mercurian',
            date: '28/06/2019',
            ordinal: 44,
            daysToGo: 180,
            category: 'Astronomical'
        },
        {
            type: 'Earth',
            date: '02/02/2019',
            ordinal: 12321,
            daysToGo: 5,
            category: 'Astronomical'
        }
    ]
}

function nth(n) {
    return n+(["st","nd","rd"][(((n<0?-n:n)+90)%100-10)%10-1]||"th");
}

class CarpeDiem {
    constructor(birthday) {
        this.birthday = birthday;
        this.date = moment.utc().startOf('day');
    }

    get days() {
        return this.calcDiff();
    }

    calcDiff() {
        return this.date.diff(this.birthday, 'days');
    }

    get birthdays() {
        let birthdays = [
            this.calcPi(),
            this.calcEuler(),
            this.calcPerfect(),
            this.calcPrime(),
            this.calcSquare(),
            this.calcSchnaps(),
            this.calcRound()
        ];
        let planets = [
            ["Mercury", 87.97],
            ["Venus", 224.7],
            ["Jupiter", 4332.71],
            ["Mars", 686.98],
            ["Saturn", 10758.5],
            ["Uranus", 30685],
            ["Neptune", 60190],
            ["Pluto", 90800]
        ]
        for (const planet of planets) {
            birthdays.push(this.calcPlanet(...planet));
        }
        return birthdays;
    }

    calcPi() {
        let pi = "3141592653";
        let pilist = [];
        for (let entry = '', i = 0; i < pi.length; i++) {
            entry += pi[i];
            pilist.push(Number(entry));
            if (Number(entry) > this.days) {
                break;
            }
        }
        return {
            category: 'Mathematical',
            type: 'Pi',
            ordinal: pilist.length,
            daysToGo: pilist.slice(-1)[0] - this.days,
            date: this.date.clone().add(pilist.slice(-1)[0] - this.days, 'days')
        }
    }

    calcEuler() {
        let eu = "2718281828";
        let eulist = [];
        for (let entry = '', i = 0; i < eu.length; i++) {
            entry += eu[i];
            eulist.push(Number(entry));
            if (Number(entry) > this.days) {
                break;
            }
        }
        return {
            category: 'Mathematical',
            type: 'Euler',
            ordinal: eulist.length,
            daysToGo: eulist.slice(-1)[0] - this.days,
            date: this.date.clone().add(eulist.slice(-1)[0] - this.days, 'days')
        }
    }

    calcPerfect() {
        let perlist = [6, 28, 496, 8128, 33550336];
        for (const [index, perf] of perlist.entries()) {
            if (perf > this.days) {
                return {
                    category: 'Mathematical',
                    type: 'Perfect',
                    ordinal: index,
                    daysToGo: perf - this.days,
                    date: this.date.clone().add(perf - this.days, 'days')
                }
            }
        }
    }

    calcPrime() {
        let primes = [];
        let sieve = [];
        for (let i = 2;; ++i) {
            if (!sieve[i]) {
                // i has not been marked -- it is prime
                primes.push(i);
                for (let j = i << 1;; j += i) {
                    sieve[j] = true;
                    if (j > this.days) {
                        break;
                    }
                }
                if (i > this.days) {
                    break;
                }
            }
        }
        return {
            category: 'Mathematical',
            type: 'Prime',
            ordinal: primes.length,
            daysToGo: primes.slice(-1)[0] - this.days,
            date: this.date.clone().add(primes.slice(-1)[0] - this.days, 'days')
        }
    }

    calcSchnaps() {
        let schlist = [];
        for (let i = 1;; i++) {
            if (/^([0-9])\1*$/.test(i)) {
                schlist.push(i);
                if (i > this.days) {
                    break;
                }
            }
        }
        return {
            category: 'Aesthetic',
            type: 'Repdigit',
            ordinal: schlist.length,
            daysToGo: schlist.slice(-1)[0] - this.days,
            date: this.date.clone().add(schlist.slice(-1)[0] - this.days, 'days')
        }
    }

    calcRound() {
        var roulist = [];
        for (let i = 1;; i++) {
            if (/^\d0+$/.test(i)) {
                roulist.push(i);
                if (i > this.days) {
                    break;
                }
            }
        }
        return {
            category: 'Aesthetic',
            type: 'Round',
            ordinal: roulist.length,
            daysToGo: roulist.slice(-1)[0] - this.days,
            date: this.date.clone().add(roulist.slice(-1)[0] - this.days, 'days')
        }
    }

    calcSquare() {
        var sqlist = [];
        for (let i = 1;; i++) {
            sqlist.push(i*i);
            if (i*i > this.days) {
                break;
            }
        }
        return {
            category: 'Mathematical',
            type: 'Square',
            ordinal: sqlist.length,
            daysToGo: sqlist.slice(-1)[0] - this.days,
            date: this.date.clone().add(sqlist.slice(-1)[0] - this.days, 'days')
        };
    }

    calcPlanet(type, rotation) {
        let ageYears = Math.floor(this.days / rotation);
        let nextBirthday = this.birthday.clone().add((ageYears + 1) * rotation, 'days')
        let daysToGo = nextBirthday.diff(this.date, 'days')
        return {
            category: 'Astronomical',
            type: type,
            ordinal: ageYears + 1,
            daysToGo: daysToGo,
            date: nextBirthday
        };
    }

    generateText(birthday, lang='en-gb') {
        return [`Congratulations! Your ${nth(birthday.ordinal)} ${birthday.type} birthday is on ${birthday.date.format('LL')}!`, `Only ${birthday.daysToGo} days to go!`]
    }
}

$(document).ready(function() {
    var locale = window.navigator.userLanguage || window.navigator.language;
    moment.locale(locale);
    $('input[name="birthday"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        maxYear: parseInt(moment().format('YYYY'),10),
        locale: {
            format: 'DD/MM/YYYY'
        }
    });
    $("#carpe-diem").on('click', function () {
        $("#result").empty();
        let date = new CarpeDiem(moment.utc($("#birthday").val(), "DD/MM/YYYY"));
        date.birthdays.forEach(function (item) {
            let container = $('<div />', {
                id: item.type,
                "class": "card text-center " + item.category
            }).appendTo($('<div />', {
                "class": "col-sm-6 col-md-4 col-lg-3"
            }))
            let body = $('<div />', {
                "class": "card-body"
            }).appendTo(container);
            $('<p>', {
                text: date.generateText(item)[0]
            }).appendTo(body);
            $('<button>', {
                "class": "btn btn-primary",
                text: "Button"
            }).appendTo(body);
            $('<div />', {
                "class": "card-footer text-muted",
                text: date.generateText(item)[1]
            }).appendTo(container)
            container.appendTo('#result');
        });
    });
});
