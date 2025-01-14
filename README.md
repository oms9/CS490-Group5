
# CS490 Group 5 Project

This is Group 5's project submission for NJIT's CS490 (Spring 2023) as instructed by [Martin Kellogg](https://web.njit.edu/~mjk76/)

## Group members:
- ### Carlos Bonilla -- cdb24
- ### Megan Curry -- mrc5
- ### Omar Shalaby -- oms9

## Project overview:

### [Covey.Town](https://github.com/neu-se/covey.town):
Covey.Town is a webapplication that brings people together, it is a place to hang-out with friends using video and text chat as well as having some activities to do but, there are no games as of now. So, the group decided to implement our version of Simon Says as a minigame for Covey.Town.

### Simon Says:
Simon Says is a toy with 4 differently colored sections that light up and have a designated sound tone associated with them. The toy would generate a pattern of blinks that the user has to recreate to win. We think this is simple enough to be played while waiting for others to connect to the town, but entertaining enough to be enjoyed on its own with modifiers. The game accepts both WASD and arrow keys for input and uses 4 colored sections in the cardinal directions, each corresponding to an input. 

Our implementation fits Covey.Town's arcade visual style as well as implementing many modifiers to improve the gameplay experience and keep it fresh as well as featuring a win-streak based leaderboard so you can compete with your friends or track your performance!
<br></br>

The planned modifiers are:

| **Modifier** | **Effect** |
|--|--|
| **Quiet!** | *Disables all the audio tones from playing.* |
| **Monotone** | *Makes all 4 sections play the same audio tone.* |
| **Monochrome** | *Gives all 4 sections the same color (gray).* |
| **Broken Bulbs** | *Disables the “flash” during pattern preview.* |
| **Mirror** | *Swaps the two opposing arcs in the pattern (N → S)* |
| **Chaos** | *Faster ramp-up, mismatched sound, fast timeout.* |

## UI Preview: 

SimonSaysUI with Right arrow event | SimonSaysUI during normal gameplay
:------------------------------------|------------------------------------:
![SimonSaysUI with Right arrow event](https://user-images.githubusercontent.com/102495444/236100641-8d780709-234f-46fb-9b5e-073a14760f6d.png) |![SimonSaysUI during normal gameplay](https://user-images.githubusercontent.com/102495444/236100638-5458c0f1-3c42-4f74-8b9d-72271be44177.png)
 This shows how the UI would look like while the game is previewing the next move in the pattern (Right in this case) and that is why the countdown/time remaining tracker shows "---" instead of a number.| This shows how the UI would look like during gameplay with 9 seconds remaining in the round, there are no events/activated arrows because there was no user input at the moment the screenshot was taken.
