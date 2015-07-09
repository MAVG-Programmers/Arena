var audio = {
    ready: false
};

audio.init = function() {
    try {
        //Only one gain is used for now; we might want to use two or more if we end up using multiple channels (e.g. for BGM and SFX)
        audio.context = new (window.AudioContext || window.webkitAudioContext)();
        audio.masterGain = audio.context.createGain();
        audio.masterGain.connect(audio.context.destination);
        audio.ready = true;
    } catch(e) {
        //TODO: Don't use a native alert for this
        alert("Your browser does not support the HTML5 Web Audio API!\nPlease upgrade to a modern browser to experience sound with this game.");
    }
};

audio.load = function(url, data, cb) {
    if(!audio.ready) { return; }

    var request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    //Argument handling so that both audio.load(url, data, cb) and audio.load(url, cb) work
    //Traditionally the callback is the last argument, but data is optional and using an object of options seems unnecessarily heavy
    if(!cb) {
        cb = data;
        data = undefined;
    }

    request.onload = function() {
        audio.context.decodeAudioData(request.response, function(buffer) {
            cb(data, buffer);
        });
    };

    request.send();
};

audio.play = function(buffer) {
    if(!audio.ready) { return; }
    
    var source = audio.context.createBufferSource();
    
    source.buffer = buffer;
    source.connect(audio.masterGain);
    source.start(0);
};

audio.getVolume = function(vol) {
    if(!audio.ready) { return; }
    
    return audio.masterGain.gain.value;
};

audio.setVolume = function(vol) {
    if(!audio.ready) { return; }
    
    audio.masterGain.gain.value = vol;
};

function Sound(file) {
    if(!audio.ready) { return; }
    
    var _this = this;

    this.ready = false;
    this.readyQueue = [];
    this.gainNode = audio.context.createGain();

    function receiveBuffer(data, buffer) {
        _this.buffer = buffer;
        _this.ready = true;

        for(var i = 0; i < _this.readyQueue.length; i++) {
            _this.readyQueue[i]();
        }
    }

    audio.load(file, receiveBuffer);
}

Sound.prototype.play = function() {
    if(!audio.ready) { return; }
    
    audio.play(this.buffer);
};

Sound.prototype.onReady = function(fn) {
    if(this.ready) {
        fn();
    } else {
        this.readyQueue.push(fn);
    }
};

function SoundBank(files) {
    if(!audio.ready) { return; }
    
    var received = 0,
        _this = this;

    this.ready = false;
    this.readyQueue = [];
    this.readyCount = 0;
    this.bank = [];
    this.last = -1;
    this.gainNode = audio.context.createGain();

    function receiveReady() {
        //Every time receiveReady is called, it increments the count of received files and checks to see if it matches the total number expected
        //Once it does, then all the files have been received and the ready queue for the SoundBank can be executed
        if(++_this.readyCount === files.length) {
            _this.ready = true;

            for(var i = 0; i < _this.readyQueue.length; i++) {
                _this.readyQueue[i]();
            }
        }
    }

    //This creates a new Sound for all the elements of the SoundBank and attaches receiveReady to each of them
    for(var i = 0; i < files.length; i++) {
        _this.bank.push(new Sound(files[i]));
        _this.bank[i].onReady(receiveReady);
    }
}

SoundBank.prototype.playNext = function() {
    if(!audio.ready) { return; }
    
    //This just increments the index and wraps it around the number of sounds in the bank
    this.last = (this.last + 1) % this.bank.length;
    this.bank[this.last].play();
};

SoundBank.prototype.onReady = function(fn) {
    if(this.ready) {
        fn();
    } else {
        this.readyQueue.push(fn);
    }
};