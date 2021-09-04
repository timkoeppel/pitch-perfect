const ScreenManager = {
    _DOM: {
        // windows
        win_main: undefined,
        win_about: undefined,

        // main windows
        win_setup: undefined,
        win_trainer: undefined,

        // containers
        tones_ctn: undefined,

        // navbar elements
        nav_main: undefined,
        nav_about: undefined,

        // trainer elements
        play_btn: undefined,
        toSetup_btn: undefined,
        note_card: undefined,
        note_card_text: undefined,
        tones: undefined,
        total_score: undefined,
        correct_score: undefined,
        trainer_help: undefined,

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
        ScreenManager._DOM.win_main.classList.remove("hidden");
        ScreenManager._DOM.win_about.classList.add("hidden");

        // style changes
        ScreenManager._DOM.nav_main.querySelector("a").classList.add("active");
        ScreenManager._DOM.nav_about.querySelector("a").classList.remove("active");
    },

    changeToAboutScreen: function () {
        // display
        ScreenManager._DOM.win_main.classList.add("hidden");
        ScreenManager._DOM.win_about.classList.remove("hidden");

        // style changes
        ScreenManager._DOM.nav_main.querySelector("a").classList.remove("active");
        ScreenManager._DOM.nav_about.querySelector("a").classList.add("active");
    },

    changeToSetupScreen: function () {
        ScreenManager._DOM.win_setup.classList.remove("hidden");
        ScreenManager._DOM.win_trainer.classList.add("hidden");
        ScreenManager.hideNote();
    },

    changeToTrainerScreen: function () {
        ScreenManager._DOM.win_setup.classList.add("hidden");
        ScreenManager._DOM.win_trainer.classList.remove("hidden");
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
        ScreenManager.setScore(0, 0);
        ScreenManager.setTrainerHelp(true);
        ScreenManager.initiateTrainerScreenNotes(gui_octaves);
        ScreenManager.changeToTrainerScreen();
    },

    initiateTrainerScreenNotes: function (gui_octaves) {
        // buttons
        let tones_ctn = "";
        gui_octaves.forEach(oct => {
            let oct_group = `<div class="btn-group Oct-${oct[0].slice(-1)}">`;

            oct.forEach(note => {
                const note_pretty = ScreenManager._makePrettyHTMLNoteName(note);
                const note_btn = `<button type="button" id="${note}" class="btn btn-outline-dark tones">${note_pretty}</button>`;
                oct_group += note_btn;
            });
            tones_ctn += oct_group + "</div>";
        });

        ScreenManager._DOM.tones_ctn.innerHTML = tones_ctn;

        // Define DOM element and add handling
        ScreenManager._DOM.tones = document.getElementsByClassName("tones");
        Array.from(ScreenManager._DOM.tones).forEach(tone => {
            tone.addEventListener("click", () => {
                Trainer.guessNote(tone.id);
            });
        });
    },

    showNote: function () {
        ScreenManager._DOM.note_card_text.classList.remove("invisible");
    },

    hideNote: function () {
        ScreenManager._DOM.note_card_text.classList.add("invisible");
    },

    visualFeedback: async function(id, type){
        const guessed = document.getElementById(id);

        ScreenManager._DOM.note_card.classList.add("text-white", `bg-${type}`);
        guessed.classList.remove("btn-outline-dark");
        guessed.classList.add(`btn-${type}`);

        await new Promise(r => setTimeout(r, 2000));

        ScreenManager._DOM.note_card.classList.remove("text-white", `bg-${type}`);
        guessed.classList.remove(`btn-${type}`);
        guessed.classList.add("btn-outline-dark");
    },

    setScore: function (correct, total) {
        ScreenManager._DOM.correct_score.innerHTML = correct;
        ScreenManager._DOM.total_score.innerHTML = total;
    },

    setTrainerHelp: function (play_mode) {
        const help = ScreenManager._DOM.trainer_help;
        const play = "Press Play!";
        const select = "Select the heard note!";

        play_mode ? help.innerHTML = play : help.innerHTML = select;
    },

    init: function () {
        // DOM initialization
        const DOM = this._DOM;
        DOM.win_main = document.getElementById("win-main");
        DOM.win_about = document.getElementById("win-about");
        DOM.win_setup = document.getElementById("win-setup");
        DOM.win_trainer = document.getElementById("win-trainer");
        DOM.tones_ctn = document.getElementById("tones-ctn");

        DOM.nav_main = document.getElementById("nav-pitch-trainer");
        DOM.nav_about = document.getElementById("nav-about");

        DOM.diff_btns = document.getElementsByClassName("diff-btn");
        DOM.custom_btn = document.getElementById("custom-btn");
        DOM.easy_btn = document.getElementById("easy-btn");
        DOM.adv_btn = document.getElementById("adv-btn");
        DOM.exp_btn = document.getElementById("exp-btn");

        DOM.octaves = document.getElementsByClassName("octave");
        DOM.chromatic_switch = document.getElementById("chromatic-switch");
        DOM.create_btn = document.getElementById("create-btn");

        DOM.play_btn = document.getElementById("play-btn");
        DOM.toSetup_btn = document.getElementById("toSetup-btn");
        DOM.note_card = document.getElementById("note-card");
        DOM.note_card_text = document.getElementById("note-card-text");
        DOM.total_score = document.getElementById("total-score");
        DOM.correct_score = document.getElementById("correct-score");
        DOM.trainer_help = document.getElementById("trainer-help");

        /*
        EVENT HANDLERS
         */
        // Navbar handling
        DOM.nav_main.addEventListener("click", this.changeToMainScreen);
        DOM.nav_about.addEventListener("click", this.changeToAboutScreen);

        // setup handling
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

        // trainer handling
        DOM.play_btn.addEventListener("click", Trainer.playTone);
        DOM.toSetup_btn.addEventListener("click", this.changeToSetupScreen);
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

    _makePrettyHTMLNoteName: function (note) {
        let pretty_note = `${note.slice(0, -1)}`;
        pretty_note = pretty_note.replaceAll("b", "\u266D");
        pretty_note = pretty_note.replaceAll("#", "\u266F");
        let index = `<sub>${note.slice(-1)}</sub>`;
        return pretty_note + index;
    },
};