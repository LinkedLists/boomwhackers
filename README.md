# Installation
Run `bundle install`. After installation run both `npm run build` and `npm run start` on the terminal and run the app on `localhost:8000`

# Notes
Game notes are located in `public/javascripts/song`

Note color is defaulted to white. To change the color of the notes, in each note file place a bank that contains all the colors that you will need for example. 
```
const COLORS = {
  1: "green",
  2: "red",
  3: "yellow",
  4: "blue",
  5: "orange",
}
```

To add color, add the `color` parameter in the notes and key into the bank to get a certain color.

```
{ x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 2, hold: 0, chain: false, color: COLORS[1] },
```

A `tempo` value of `1` is a quarter note and a value of `2` is an eigth note. To have two and no more than two notes appear consecutively, set the `chain` parameter to `true` for the two notes.

To add a rest note, add the following line of code. Rest notes can have their tempo's set.

```
{ tempo: 2, hold: 0, chain: false, rest: true },
```

If you need to have a note show up more quickly, add this line.
```
{ kill: true },
```

In the main song file that bundles all the parts, `introDelay` delays the notes from showing up in milliseconds. `tempo` dictates the rate of which notes are generated in milliseconds. It does not determine how quickly the note moves across the screen. It is advised to set the tempo to the eight note BPM of the song. `dy` determines how fast the notes move across the screen.

```
export const song1 = {
  notes: [].concat(verse_1, bridge, chorus, verse_2, bridge, chorus, bridge_2, chorus_2, ending),
  introDelay: 3000,
  tempo: 319,
  dy: 8,
  totalNotes: 360
}
```

The window that the notes move in is currently set to `1300px`. This value is internal and is independent of actual browser window size. The animation is presumably set to 60 FPS. So a `dy` value of `8` means that the note will move `480px` per second and will take `2.7 seconds` for the note to finish its path.
