import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../lib/Player';
import { defaultLocation, getLastEmittedEvent } from '../TestUtils';
import ConversationArea from './ConversationArea';
import InteractableArea, { PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_WIDTH } from './InteractableArea';
class TestInteractableArea extends InteractableArea {
    toModel() {
        return { id: this.id, occupantsByID: [] };
    }
}
const HALF_W = PLAYER_SPRITE_WIDTH / 2;
const HALF_H = PLAYER_SPRITE_HEIGHT / 2;
describe('InteractableArea', () => {
    const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
    let testArea;
    const id = nanoid();
    let newPlayer;
    const townEmitter = mock();
    beforeEach(() => {
        mockClear(townEmitter);
        testArea = new TestInteractableArea(id, testAreaBox, townEmitter);
        newPlayer = new Player(nanoid(), mock());
        testArea.add(newPlayer);
    });
    describe('add', () => {
        it('Adds the player to the occupants list', () => {
            expect(testArea.occupantsByID).toEqual([newPlayer.id]);
        });
        it("Sets the player's conversationLabel and emits an update for their location", () => {
            expect(newPlayer.location.interactableID).toEqual(id);
            const lastEmittedMovement = getLastEmittedEvent(townEmitter, 'playerMoved');
            expect(lastEmittedMovement.location.interactableID).toEqual(id);
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
    });
    describe('isActive', () => {
        it('Returns true when there are players in the area', () => {
            expect(testArea.isActive).toBe(true);
        });
        it('Returns false when there are no players in the area', () => {
            testArea.remove(newPlayer);
            expect(testArea.isActive).toBe(false);
        });
    });
    describe('addPlayersWithinBounds', () => {
        let playersInArea;
        let playersNotInArea;
        beforeEach(() => {
            playersInArea = [];
            playersNotInArea = [];
            const box = testArea.boundingBox;
            for (let i = 0; i < 10; i++) {
                const player = new Player(nanoid(), mock());
                player.location.x = box.x + box.width / 2;
                player.location.y = box.y + box.height / 2;
                playersInArea.push(player);
            }
            for (let i = 0; i < 10; i++) {
                const player = new Player(nanoid(), mock());
                player.location.x = -100;
                player.location.y = -100;
                playersNotInArea.push(player);
            }
            const mixedPlayers = playersInArea
                .concat(playersNotInArea)
                .sort((a, b) => a.id.localeCompare(b.id));
            testArea.addPlayersWithinBounds(mixedPlayers);
        });
        it('Does not include players not within the area', () => {
            playersNotInArea.forEach(player => expect(testArea.occupantsByID.includes(player.id)).toBe(false));
        });
        it('Includes all players that are within the area', () => {
            playersInArea.forEach(player => expect(testArea.occupantsByID.includes(player.id)).toBe(true));
            expect(playersInArea.length).toEqual(playersInArea.length);
        });
    });
    describe('contains', () => {
        const { x, y, width, height } = testAreaBox;
        it.each([
            { x: x + width / 2, y: y + width / 2 },
            { x: x + 10 + width / 2, y: y + 10 + width / 2 },
            { x: x - 1 + width, y: y + 1 },
            { x: x + 1, y: y + 1 },
            { x: x - 1 + width, y: y - 1 + height },
            { x: x + 1, y: y - 1 + height },
        ])('Returns true for locations that are inside of the area %p', (location) => {
            expect(testArea.contains({ ...defaultLocation(), x: location.x, y: location.y })).toBe(true);
        });
        it.each([
            { x: x - 1 + HALF_W + width, y: y + 1 - HALF_H },
            { x: x + 1 - HALF_W, y: y + 1 - HALF_H },
            { x: x - 1 + HALF_W + width, y: y - 1 + HALF_H + height },
            { x: x + 1 - HALF_W, y: y - 1 + HALF_H + height },
        ])('Returns true for locations that are outside of the area, but are included due to the player sprite size overlapping with the target area', (location) => {
            expect(testArea.contains({ ...defaultLocation(), x: location.x, y: location.y })).toBe(true);
        });
        it.each([
            { x: x + HALF_W + width, y: y - HALF_H },
            { x: x - HALF_W, y: y - HALF_H },
            { x: x + HALF_W + width, y: y + HALF_H + height },
            { x: x - HALF_W, y: y + HALF_H + height },
        ])('Returns false for locations that exactly hit the edge of the area', (location) => {
            expect(testArea.contains({ ...defaultLocation(), x: location.x, y: location.y })).toBe(false);
        });
        it.each([
            { x: x + width * 2, y: y - height },
            { x: x - width, y: y - width },
            { x: x + width * 2, y: y + height * 2 },
            { x: x - width, y: y + height * 2 },
            { x: x + 1, y: y - height },
            { x: x - width, y: y + 1 },
            { x: x + width * 2, y: y + 1 },
            { x: x + 1, y: y + height * 2 },
        ])('Returns false for locations that are outside of the area', (location) => {
            expect(testArea.contains({ ...defaultLocation(), x: location.x, y: location.y })).toBe(false);
        });
    });
    describe('overlaps', () => {
        const cheight = testAreaBox.height / 2;
        const cwidth = testAreaBox.width / 2;
        const cx = testAreaBox.x + cwidth;
        const cy = testAreaBox.y + cheight;
        const { x, y, height, width } = testAreaBox;
        it.each([
            { x: cx, y: cy, width: 2, height: 2 },
            { x: cx + 4, y: cy + 4, width: 2, height: 2 },
            { x: cx + 4, y: cy + 4, width: 2, height: 2 },
        ])('Returns true for locations that are contained entirely %p', (intersectBox) => {
            expect(testArea.overlaps(new ConversationArea({ id: 'testArea', occupantsByID: [] }, intersectBox, mock()))).toBe(true);
        });
        it.each([
            { x: x - 50, y: y - 50, width: 100, height: 100 },
            { x: x - 50, y: y + height - 50, width: 100, height: 100 },
            { x: x + width - 50, y: y - 50, width: 100, height: 100 },
            { x: x + width - 50, y: y + height - 50, width: 100, height: 100 },
            {
                x: x - PLAYER_SPRITE_WIDTH / 2,
                y: y - PLAYER_SPRITE_HEIGHT / 2,
                width: PLAYER_SPRITE_WIDTH + 1,
                height: PLAYER_SPRITE_HEIGHT + 1,
            },
            {
                x: x - PLAYER_SPRITE_WIDTH / 2,
                y: y + height + PLAYER_SPRITE_HEIGHT / 2,
                width: PLAYER_SPRITE_WIDTH + 1,
                height: PLAYER_SPRITE_HEIGHT + 1,
            },
            {
                x: x + width + PLAYER_SPRITE_WIDTH / 2,
                y: y - PLAYER_SPRITE_HEIGHT / 2,
                width: PLAYER_SPRITE_WIDTH + 1,
                height: PLAYER_SPRITE_HEIGHT + 1,
            },
            {
                x: x + width + PLAYER_SPRITE_WIDTH / 2,
                y: y + height + PLAYER_SPRITE_HEIGHT / 2,
                width: PLAYER_SPRITE_WIDTH + 1,
                height: PLAYER_SPRITE_HEIGHT + 1,
            },
        ])('Returns true for locations that are overlapping with edges %p', (intersectBox) => {
            expect(testArea.overlaps(new ConversationArea({ id: 'testArea', occupantsByID: [] }, intersectBox, mock()))).toBe(true);
        });
        it.each([
            { x: x - 50, y: y - 50, width: 10, height: 10 },
            { x: x - 50, y: y + height + 50, width: 10, height: 10 },
            { x: x + width + 50, y: y - 50, width: 100, height: 100 },
            { x: x + width + 50, y: y + height + 50, width: 100, height: 100 },
            {
                x: x - PLAYER_SPRITE_WIDTH * 1.5,
                y: y - PLAYER_SPRITE_HEIGHT * 1.5,
                width: PLAYER_SPRITE_WIDTH / 2,
                height: PLAYER_SPRITE_HEIGHT / 2,
            },
            {
                x: x - PLAYER_SPRITE_WIDTH,
                y: y + height + PLAYER_SPRITE_HEIGHT,
                width: PLAYER_SPRITE_WIDTH,
                height: PLAYER_SPRITE_HEIGHT,
            },
            {
                x: x + width + PLAYER_SPRITE_WIDTH,
                y: y - PLAYER_SPRITE_HEIGHT,
                width: PLAYER_SPRITE_WIDTH,
                height: PLAYER_SPRITE_HEIGHT,
            },
            {
                x: x + width + PLAYER_SPRITE_WIDTH,
                y: y + height + PLAYER_SPRITE_HEIGHT,
                width: PLAYER_SPRITE_WIDTH,
                height: PLAYER_SPRITE_HEIGHT,
            },
        ])('Returns false for locations that have no overlap %p', (intersectBox) => {
            expect(testArea.overlaps(new ConversationArea({ id: 'testArea', occupantsByID: [] }, intersectBox, mock()))).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3RhYmxlQXJlYS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rvd24vSW50ZXJhY3RhYmxlQXJlYS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNoQyxPQUFPLE1BQU0sTUFBTSxlQUFlLENBQUM7QUFDbkMsT0FBTyxFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUVwRSxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sZ0JBQWdCLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRWpHLE1BQU0sb0JBQXFCLFNBQVEsZ0JBQWdCO0lBQzFDLE9BQU87UUFDWixPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsYUFBYSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQzVDLENBQUM7Q0FDRjtBQUNELE1BQU0sTUFBTSxHQUFHLG1CQUFtQixHQUFHLENBQUMsQ0FBQztBQUN2QyxNQUFNLE1BQU0sR0FBRyxvQkFBb0IsR0FBRyxDQUFDLENBQUM7QUFFeEMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNoRSxJQUFJLFFBQTBCLENBQUM7SUFDL0IsTUFBTSxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUM7SUFDcEIsSUFBSSxTQUFpQixDQUFDO0lBQ3RCLE1BQU0sV0FBVyxHQUFHLElBQUksRUFBZSxDQUFD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