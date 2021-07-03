const Trainer = {
    training_set: undefined,


    playTone: function (tone) {
        //create a synth and connect it to the main output (your speakers)
        const synth = new Tone.Synth().toDestination();

        //play a middle 'C' for the duration of an 8th note
        synth.triggerAttackRelease(tone, "2n");
    },

    createAllOctaves: function (index_list, use_chromatic) {
        let octaves = [];
        index_list.forEach(index => {
            octaves.push(Trainer._createSingleOctave(index, use_chromatic));
        });

        return octaves;
    },

    setupTrainer: function (octave_indexes, use_chromatic) {
        const gui_octaves = Trainer.createAllOctaves(octave_indexes, use_chromatic);
        Trainer.setTrainingSet(gui_octaves);
        return gui_octaves;
    },

    setTrainingSet: function (octaves_matrix) {
        Trainer.training_set = octaves_matrix.flat();
        console.log(Trainer.training_set);
    },

    _createSingleOctave: function (index, use_chromatic) {
        const base_octaves = use_chromatic ? ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
            : ["C", "D", "E", "F", "G", "A", "B"];

        let octave = [];
        base_octaves.forEach(note => {
            octave.push(note + index);
        });

        return octave;
    },
};

const ScreenManager = {
    _DOM: {
        // windows
        win_main: undefined,
        win_about: undefined,
        win_setup: undefined,
        win_trainer: undefined,

        // navbar elements
        nav_main: undefined,
        nav_about: undefined,

        // play button
        play_btn: undefined,

        // setup elements
        diff_btns: undefined,
        custom_btn: undefined,
        easy_btn: undefined,
        adv_btn: undefined,
        exp_btn: undefined,
        octaves: undefined,
        chromatic_switch: undefined,
        create_btn: undefined,
    },

    changeToMainScreen: function () {
        // display
        ScreenManager._DOM.win_main.classList.remove("invisible");
        ScreenManager._DOM.win_about.classList.add("invisible");

        // style changes
        ScreenManager._DOM.win_main.querySelector("a").classList.add("active");
        ScreenManager._DOM.nav_about.querySelector("a").classList.remove("active");
    },

    changeToAboutScreen: function () {
        // display
        ScreenManager._DOM.win_main.classList.add("invisible");
        ScreenManager._DOM.win_about.classList.remove("invisible");

        // style changes
        ScreenManager._DOM.win_main.querySelector("a").classList.remove("active");
        ScreenManager._DOM.nav_about.querySelector("a").classList.add("active");
    },

    changeToSetupScreen: function () {
        ScreenManager._DOM.win_setup.classList.remove("invisible");
        ScreenManager._DOM.win_trainer.classList.add("invisible");
    },

    changeToTrainerScreen: function () {
        ScreenManager._DOM.win_setup.classList.add("invisible");
        ScreenManager._DOM.win_trainer.classList.remove("invisible");
    },

    setupCustom: function () {
        ScreenManager._setAllOctavesUnchecked();
    },

    setupEasy: function () {
        // octave 4
        ScreenManager._setAllOctavesUnchecked();
        ScreenManager._DOM.octaves[4].checked = true;

        // chromatic off
        ScreenManager._DOM.chromatic_switch.checked = false;
    },

    setupAdvanced: function () {
        // octaves 0 - 6
        ScreenManager._setAllOctavesUnchecked();
        for (let i = 0; i < 7; i++) {
            ScreenManager._DOM.octaves[i].checked = true;
        }

        // chromatic off
        ScreenManager._DOM.chromatic_switch.checked = false;
    },

    setupExpert: function () {
        // octaves 0 - 6
        ScreenManager._setAllOctavesUnchecked();
        for (let i = 0; i < 7; i++) {
            ScreenManager._DOM.octaves[i].checked = true;
        }

        // chromatic on
        ScreenManager._DOM.chromatic_switch.checked = true;
    },

    setActiveDifficultyButton: function () {
        if (ScreenManager._checkEasy()) {
            ScreenManager._DOM.easy_btn.click();
        } else if (ScreenManager._check_advanced()) {
            ScreenManager._DOM.adv_btn.click();
        } else if (ScreenManager._checkExpert()) {
            ScreenManager._DOM.exp_btn.click();
        } else {
            ScreenManager._DOM.custom_btn.checked = true;
        }
    },

    adjustCreationPossibility: function () {
        if (ScreenManager._checkUnsetOctaves(0, 9)) {
            ScreenManager._DOM.create_btn.setAttribute("disabled", true);
        } else {
            ScreenManager._DOM.create_btn.removeAttribute("disabled");
        }
    },

    createTrainer: function () {
        // gather training data
        const octave_indexes = ScreenManager._gatherAllOctaveIndexes();
        const use_chromatic = ScreenManager._DOM.chromatic_switch.checked;
        const gui_octaves = Trainer.setupTrainer(octave_indexes, use_chromatic);

        // setup trainer screen
        ScreenManager.initiateTrainerScreenNotes(gui_octaves);
        ScreenManager.changeToTrainerScreen();
    },

    initiateTrainerScreenNotes: function (gui_octaves) {
        let oct_form = `<form class="d-flex justify-content-start flex-column align-items-center">`;

        // back button
        // TODO add back button to setup (+ reset)

        // play button
        // TODO add play button with loader

        // buttons
        gui_octaves.forEach(oct => {
            let oct_group = `<div class="btn-group btn-group-lg ${oct[0].slice(-1)}">`;

            oct.forEach(note => {
                const note_pretty = ScreenManager._makePrettyHTMLNoteName(note);
                const note_btn = `<button id="${note}" class="btn btn-outline-dark notes">${note_pretty}</button>`;
                oct_group += note_btn;
            });
            oct_form += oct_group + "</div>";
        });

        ScreenManager._DOM.win_trainer.innerHTML = oct_form + "</form>";

        // TODO addEventListener to play button
        // TODO addEventListener to note buttons
    },

    init: function () {
        // DOM initialization
        const DOM = this._DOM;
        DOM.win_main = document.getElementById("win-main");
        DOM.win_about = document.getElementById("win-about");
        DOM.win_setup = document.getElementById("win-setup");
        DOM.win_trainer = document.getElementById("win-trainer");

        DOM.nav_main = document.getElementById("nav-pitch-trainer");
        DOM.nav_about = document.getElementById("nav-about");

        //DOM.play_btn = document.getElementById("play-btn");
        DOM.diff_btns = document.getElementsByClassName("diff-btn");
        DOM.custom_btn = document.getElementById("custom-btn");
        DOM.easy_btn = document.getElementById("easy-btn");
        DOM.adv_btn = document.getElementById("adv-btn");
        DOM.exp_btn = document.getElementById("exp-btn");

        DOM.octaves = document.getElementsByClassName("octave");
        DOM.chromatic_switch = document.getElementById("chromatic-switch");
        DOM.create_btn = document.getElementById("create-btn");

        // Navbar handling
        DOM.nav_main.addEventListener("click", this.changeToMainScreen);
        DOM.nav_about.addEventListener("click", this.changeToAboutScreen);

        // play handling
        //DOM.play_btn.addEventListener("click", this.playTone);

        // difficulty handling
        DOM.custom_btn.addEventListener("click", this.setupCustom);
        DOM.easy_btn.addEventListener("click", this.setupEasy);
        DOM.adv_btn.addEventListener("click", this.setupAdvanced);
        DOM.exp_btn.addEventListener("click", this.setupExpert);
        Array.from(DOM.diff_btns).forEach(btn => {
            btn.addEventListener("change", this.adjustCreationPossibility);
        });
        Array.from(DOM.octaves).forEach(oct => {
            oct.addEventListener("click", this.setActiveDifficultyButton);
            oct.addEventListener("change", this.adjustCreationPossibility);
        });
        DOM.chromatic_switch.addEventListener("click", this.setActiveDifficultyButton);
        DOM.create_btn.addEventListener("click", this.createTrainer);
    },

    _setAllOctavesUnchecked: function () {
        Array.from(ScreenManager._DOM.octaves).forEach(oct => {
            oct.checked = false;
        });
    },

    _checkEasy: function () {
        let others_unchecked = true;
        let fourth = false;
        for (let i = 0; i < ScreenManager._DOM.octaves.length; i++) {
            if (ScreenManager._DOM.octaves[i].checked) {
                if (i === 4) {
                    fourth = true;
                } else {
                    others_unchecked = false;
                }
            }
        }
        return others_unchecked && fourth && !ScreenManager._DOM.chromatic_switch.checked;
    },

    _checkSetOctaves: function (from, to) {
        let all_oct = true;
        for (let i = from; i < to; i++) {
            if (!ScreenManager._DOM.octaves[i].checked) {
                all_oct = false;
            }
        }
        return all_oct;
    },

    _checkUnsetOctaves: function (from, to) {
        let all_oct = true;
        for (let i = from; i < to; i++) {
            if (ScreenManager._DOM.octaves[i].checked) {
                all_oct = false;
            }
        }
        return all_oct;
    },

    _check_advanced: function () {
        return ScreenManager._checkSetOctaves(0, 7) && ScreenManager._checkUnsetOctaves(7, 9) && !ScreenManager._DOM.chromatic_switch.checked;
    },

    _checkExpert: function () {
        return ScreenManager._checkSetOctaves(0, 7) && ScreenManager._checkUnsetOctaves(7, 9) && ScreenManager._DOM.chromatic_switch.checked;
    },

    _gatherAllOctaveIndexes: function () {
        const checked_octaves = document.querySelectorAll(".octave:checked");

        let octave_indexes = [];
        Array.from(checked_octaves).forEach(oct => {
            octave_indexes.push(oct.id.substr(1, 1));
        });
        return octave_indexes;
    },

    _makePrettyHTMLNoteName: function(note){
        let pretty_note = `${note.slice(0, -1)}<sub>${note.slice(-1)}</sub>`;
        pretty_note = pretty_note.replaceAll("b", "\u266D");
        pretty_note = pretty_note.replaceAll("#", "\u266F");
        return pretty_note;
    },
};

document.addEventListener('DOMContentLoaded', () => {
    ScreenManager.init();
});