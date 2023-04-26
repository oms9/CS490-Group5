import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../lib/Player';
import { getLastEmittedEvent } from '../TestUtils';
import { TownEmitter } from '../types/CoveyTownSocket';
import SimonSaysArea from './SimonSaysArea';

describe('SimonSaysArea', () => {
  const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
  let testArea: SimonSaysArea;
  const id = nanoid();
  const pattern = 'WASD';
  const round = 1;
  let newPlayer: Player;
  const townEmitter = mock<TownEmitter>();
  let leaderboard: [];

  beforeEach(() => {
    mockClear(townEmitter);
    testArea = new SimonSaysArea({ id, pattern, round, leaderboard }, testAreaBox, townEmitter);
    newPlayer = new Player(nanoid(), mock<TownEmitter>());
    testArea.add(newPlayer);
  });
  describe('testArea is set up', () => {
    it('initializes correctly', () => {
      expect(testArea.pattern).toBe('WASD');
      expect(testArea.round).toBe(1);
      expect(testArea.leaderboard).toEqual([]);
    });
  });
  describe('remove', () => {
    it('Removes the player from the list of occupants', () => {
      testArea.remove(newPlayer);
      expect(testArea.occupantsByID).toEqual([]);
    });
    it("Clears the player's conversationLabel and emits an update for their location", () => {
      mockClear(townEmitter);
      testArea.remove(newPlayer);
      expect(newPlayer.location.interactableID).toBeUndefined();
      const lastEmittedMovement = getLastEmittedEvent(townEmitter, 'playerMoved');
      expect(lastEmittedMovement.location.interactableID).toBeUndefined();
    });
    it('Clears past pattern when player leaves', () => {
      testArea.remove(newPlayer);
      expect(testArea.pattern).toEqual(undefined);
    });
  });
  describe('updateModel', () => {
    it('updates the model correctly', () => {
      const updatedModel = { pattern: 'WASDWASD', round: 2, id: '1', leaderboard: [] };
      testArea.updateModel(updatedModel);
      expect(testArea.pattern).toBe('WASDWASD');
      expect(testArea.round).toBe(2);
    });
  });
  describe('toModel', () => {
    it('converts to a model correctly', () => {
      const model = testArea.toModel();
      expect(model).toEqual({
        id,
        pattern,
        round,
        leaderboard,
        occupantsByID: [newPlayer.id],
      });
    });
  });
  describe('fromMapObject', () => {
    it('Throws an error if the width or height are missing', () => {
      expect(() =>
        SimonSaysArea.fromMapObject(
          { id: 1, name: nanoid(), visible: true, x: 0, y: 0 },
          townEmitter,
        ),
      ).toThrowError();
    });
    it('Creates a new simon says area using the provided boundingBox and id, with an empty occupants list', () => {
      const x = 30;
      const y = 20;
      const width = 10;
      const height = 20;
      const name = 'name';
      const val = SimonSaysArea.fromMapObject(
        { x, y, width, height, name, id: 10, visible: true },
        townEmitter,
      );
      expect(val.boundingBox).toEqual({ x, y, width, height });
      expect(val.id).toEqual(name);
      expect(val.pattern).toBeUndefined();
      expect(val.round).toEqual(0);
      expect(val.leaderboard).toEqual([]);
      expect(val.occupantsByID).toEqual([]);
    });
  });
  describe('generatePattern', () => {
    it('Generates a pattern of the specified length', () => {
      const patternLength = 10;
      const longPattern = testArea.generatePattern(patternLength);
      expect(longPattern.length).toBe(patternLength);
    });
  });
});
