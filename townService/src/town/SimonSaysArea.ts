import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import * as fs from 'fs/promises';
import Player from '../lib/Player';
import {
  BoundingBox,
  LeaderboardEntry,
  SimonSaysArea as SimonSaysModel,
  TownEmitter,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

import { removeThisFunctionCallWhenYouImplementThis } from '../Utils';

/**
 * Function to be used for random pattern, delay and duration generation
 * NOTE: min is inclusive, max is exclusive, so use a +1 on the max call
 */
function getRandInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export default class SimonSaysArea extends InteractableArea {
  private _pattern?: string;

  private _round: number;

  private _leaderboard: LeaderboardEntry[];

  public get pattern() {
    return this._pattern;
  }

  public get round() {
    return this._round;
  }

  public get leaderboard() {
    return this._leaderboard;
  }

  /**
   * Creates a new SimonSaysArea
   *
   * @param SimonSays model containing this area's starting state
   * @param coordinates the bounding box that defines this simon says area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   * leaderboard is not passed in because it should be imported from the appropriate .json file
   */
  public constructor(
    { id, pattern, round }: SimonSaysModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this._pattern = pattern;
    this._round = round;
    this._leaderboard = [] as LeaderboardEntry[];
    this._loadLeaderboard();
  }

  /**
   * Removes a player from this simon says area.
   *
   * When the last player leaves, this method clears the video of this area and
   * emits that update to all of the players
   *
   * @param player
   */
  public remove(player: Player): void {
    super.remove(player);
    if (this._occupants.length === 0) {
      this._pattern = undefined;
      this._emitAreaChanged();
    }
  }

  /**
   * Updates the state of this SimonSaysArea, setting the new pattern and round counter
   *
   * @param SimonSays updated model
   */
  public updateModel({ pattern, round }: SimonSaysModel) {
    this._pattern = pattern;
    this._round = round;
  }

  /**
   * Convert this SimonSaysArea instance to a simple SimonSaysModel suitable for
   * transporting over a socket to a client.
   */
  public toModel(): SimonSaysModel {
    return {
      id: this.id,
      pattern: this.pattern,
      round: this._round,
      leaderboard: this._leaderboard,
    };
  }

  /**
   * Creates a new SimonSays object that will represent a Simon Says object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this simon says area exists
   * @param townEmitter An emitter that can be used by this simon says area to broadcast updates to players in the town
   * @returns
   */
  public static fromMapObject(mapObject: ITiledMapObject, townEmitter: TownEmitter): SimonSaysArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed simon says area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new SimonSaysArea(
      { pattern: undefined, id: name, round: 0, leaderboard: [] },
      rect,
      townEmitter,
    );
  }

  /**
   * Generate a random pattern of blinks/events comprised of up/down/left/right as N/S/L/W
   * transporting over a socket to a client.
   */
  public generatePattern(len: number): string {
    let letter = 'WASD'[getRandInt(0, 4)];
    for (let i = 0; i < len; i++) {
      letter = 'WASD'[getRandInt(0, 4)];
      if (this.pattern) {
        this._pattern = this.pattern + letter;
      } else {
        this._pattern = letter;
      }
    }
    if (this._pattern) {
      return this._pattern;
    }
    return letter;
  }

  /**
   * Function to load the leaderboard into memory to be displayed and updated.
   */
  private async _loadLeaderboard(): Promise<void> {
    this._leaderboard = JSON.parse(
      await fs.readFile('../../../shared/SSleaderboard.json', 'utf-8'),
    ) as LeaderboardEntry[];
  }

  /**
   * Function to save the current leaderboard to the .json, should be called at the end of gameplayLoop
   */
  private async _saveLeaderboard(): Promise<void> {
    const data = JSON.stringify(this.leaderboard);
    await fs.writeFile('../../../shared/SSleaderboard.json', data, 'utf-8');
  }

  /**
   * Function to update the leaderboard with the player's current streak, setting a new highscore if
   * the current streak is > highscore, also stores last pattern played
   */
  private _leaderboardUpdate(currPlayer: Player, currStreak: number): void {
    let updatedEntry: LeaderboardEntry;
    // if the player has a record in the leaderboards already
    if (this.leaderboard.filter(it => it.playerID === currPlayer.id).length > 0) {
      const temp: number = this.leaderboard.filter(it => it.playerID === currPlayer.id)[0].playerID
        .bestStreak;

      let highscore: number;
      // if the player's highscore is greater than the current streak, it remains the highest
      if (temp > currStreak) {
        highscore = temp;
      } else {
        // if it isn't, the highscore is updated
        highscore = currStreak;
      }
      // we create the updated entry based on the two possibilites for highscore
      updatedEntry = {
        playerID: currPlayer.id,
        stats: {
          currentSreak: currStreak,
          bestStreak: highscore,
          lastPattern: this._pattern as string,
        },
      };
    } else {
      // this is the updated entry if the player doesn't have a previous entry in the leaderboard
      updatedEntry = {
        playerID: currPlayer.id,
        stats: {
          currentSreak: currStreak,
          bestStreak: currStreak,
          lastPattern: this._pattern as string,
        },
      };
    }
    // update the leaderboard variable with the new stats
    this.leaderboard.filter(it => it.playerID === currPlayer.id)[0] = updatedEntry;
  }

  /**
   * Main gameplay loop placeholder
   */
  private _gameplayLoop(): void {
    this._round += 1;
    throw new Error('not implemented yet');
  }
}
