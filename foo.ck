// SinOsc soprano => Pan2 mpan => dac;
// TriOsc bass => dac;

// 0.5 => float onGain;
// 0.0 => float offGain;

// [
// 	57, 57, 64, 64, 66, 66, 64,
// 	62, 62, 61, 61, 59, 59, 57
// ] @=> int sopranoMIDI[];

// [
// 	61, 61, 57, 61, 62, 62, 61,
// 	59, 56, 57, 52, 52, 68, 69
// ] @=> int bassMIDI[];

// [
// 	"Twin","kle","twin","kle","lit","tle","star,",
// 	"how", "I","won","der","what","you","are."
// ] @=> string words[];

// 0.5 :: second => dur q;
// 1.0 :: second => dur h;

// [
// 	q, q, q, q, q, q, h, q, q, q, q, q, q, h
// ] @=> dur durations[];

// for (0 => int i; i < sopranoMIDI.cap(); i++) {
//	<<< words[i] >>>;

//	Std.mtof(sopranoMIDI[i]) => soprano.freq;
//	Std.mtof(bassMIDI[i]) => bass.freq;

//	Math.random2f(-1.0, 1.0) => mpan.pan;

//	onGain => soprano.gain => bass.gain;

	// 0.7 * durations[i] => now;

//	offGain => soprano.gain => bass.gain;

	// 0.3 * durations[i] => now;
// }

Impulse imp => ResonZ rez => Gain input => dac;

100 => rez.Q;
100 => rez.gain;
1.0 => input.gain;

Delay del[3];

input => del[0] => dac.left;
input => del[1] => dac;
input => del[2] => dac.right;

for (0 => int i; i < 3; i++) {
	del[i] => del[i];
	0.6 => del[i].gain;
	(0.8 + i * 0.3)::second => del[i].max => del[i].delay;
}

[50, 54, 55, 55, 57, 70, 72] @=> int notes[];

notes.cap() - 1 => int numNotes;

while (1) {
	Std.mtof(notes[Math.random2(0, numNotes)]) => rez.freq;
	1.0 => imp.next;
	(Math.random2(0, 1) + 0.1 * 0.8)::second => now;
}
