const Trainer = {
    training_set: undefined,
    current: undefined,
    guessed: undefined,
    total_score: undefined,
    correct_score: undefined,

    playTone: function () {
        // tone preparation
        let tone = Trainer.current;

        if (Trainer.guessed) {
            Trainer.guessed = false;
            while (tone === Trainer.current) {
                tone = Trainer.training_set[Math.floor(Math.random() * Trainer.training_set.length)];
                console.log(tone);
            }
            Trainer.current = tone;
            ScreenManager._DOM.note_card_text.innerHTML = ScreenManager._makePrettyHTMLNoteName(tone);
        }
        ScreenManager.hideNote();
        ScreenManager.setTrainerHelp(false);

        // play
        const synth = new Tone.Synth().toDestination();
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
        Trainer.guessed = true;
        Trainer.total_score = 0;
        Trainer.correct_score = 0;

        return gui_octaves;
    },

    setTrainingSet: function (octaves_matrix) {
        Trainer.training_set = octaves_matrix.flat();
    },

    guessNote: function (id) {
        const current = Trainer.current;

        // only if a guess has taken place
        if (!Trainer.guessed) {
            Trainer.guessed = true;
            ScreenManager.showNote();
            ScreenManager.setTrainerHelp(true);

            if (id === current) {
                Trainer.increaseScore(true);
                ScreenManager.visualFeedback(id, "success");
            } else if(id.charAt(0) === current.charAt(0)){
                // TODO Chromatic will not work this way
                Trainer.increaseScore(true);
                ScreenManager.visualFeedback(id, "warning");
            }else {
                Trainer.increaseScore(false);
                ScreenManager.visualFeedback(id, "danger");
            }
        }
    },

    increaseScore: function (correctly_guessed) {
        if (correctly_guessed) {
            Trainer.correct_score += 1;
        }
        Trainer.total_score += 1;

        ScreenManager.setScore(Trainer.correct_score, Trainer.total_score);
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