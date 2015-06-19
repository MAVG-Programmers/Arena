var audio = {
    ready: false
};

audio.init = function() {
    try {
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
        if(++_this.readyCount === files.length) {
            _this.ready = true;

            for(var i = 0; i < _this.readyQueue.length; i++) {
                _this.readyQueue[i]();
            }
        }
    }

    for(var i = 0; i < files.length; i++) {
        _this.bank.push(new Sound(files[i]));
        _this.bank[i].onReady(receiveReady);
    }
}

SoundBank.prototype.playNext = function() {
    if(!audio.ready) { return; }
    
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