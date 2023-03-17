import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import {
  BoundingBox,
  SimonSaysArea as SimonSaysModel,
  TownEmitter,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

export default class SimonSaysArea extends InteractableArea {
    private _pattern?: string;

    private _round: number;

    public get pattern() {
      return this._pattern;
    }
  
    public get round() {
      return this._round;
    }

    /**
     * Creates a new SimonSaysArea
     *
     * @param SimonSays model containing this area's starting state
     * @param coordinates the bounding box that defines this simon says area
     * @param townEmitter a broadcast emitter that can be used to emit updates to players
     */
    public constructor(
      { id, pattern, round }: SimonSaysModel,
      coordinates: BoundingBox,
      townEmitter: TownEmitter,
    ) {
      super(id, coordinates, townEmitter);
      this._pattern = pattern;
      this._round = round;
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
    public updateModel({ pattern, round}: SimonSaysModel) {
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
      };
    }

    /**
     * Generate a random pattern of blinks/events comprised of up/down/left/right as N/S/L/W
     * transporting over a socket to a client.
     */
    public generatePattern(len: number): string {
      //TODO: implement pattern generation
      throw new Error(`Not implemented yet: ${len}`);
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
      return new SimonSaysArea({ pattern: undefined, id: name, round: 0 }, rect, townEmitter);
    }


}