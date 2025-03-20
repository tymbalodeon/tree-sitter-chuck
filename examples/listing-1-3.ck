// Author: ChucK Team
// Date: Today's date

// make a sound chain (“patch”)

SinOsc s => dac;

// prints out program name
<<< "Hello Sine!" >>>;

// set volume to 0.6
.6 => s.gain;
// set frequency to 220.0
220.0 => s.freq;
// play for 1 second
second => now;

0.5 => s.gain; // set volume to 0.5
440 => s.freq; // set frequency to 440
2::second => now; // play for two seconds

// comment out this third note for now
/*
0.3 => s.gain;
330 => s.freq;
3::second => now;
*/
