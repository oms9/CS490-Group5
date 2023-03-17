import { mock, mockDeep } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
export function createConversationForTesting(params) {
    return {
        id: params?.conversationID || nanoid(),
        occupantsByID: [],
        topic: params?.conversationTopic || nanoid(),
    };
}
export function defaultLocation() {
    return { x: 0, y: 0, moving: false, rotation: 'front', interactableID: undefined };
}
export function clearEmittedEvents(mockEmitter, eventName) {
    if (!eventName) {
        mockEmitter.emit.mock.calls = [];
    }
    else {
        mockEmitter.emit.mock.calls = mockEmitter.emit.mock.calls.filter(eachCall => eachCall[0] !== eventName);
    }
}
export function getLastEmittedEvent(emitter, eventName, howFarBack = 0) {
    const { calls } = emitter.emit.mock;
    let nCallsToSkip = howFarBack;
    for (let i = calls.length - 1; i >= 0; i--) {
        if (calls[i][0] === eventName) {
            if (nCallsToSkip === 0) {
                const param = calls[i][1];
                return param;
            }
            nCallsToSkip--;
        }
    }
    throw new Error(`No ${eventName} could be found as emitted on this socket`);
}
export function extractSessionToken(player) {
    return getLastEmittedEvent(player.socket, 'initialize').sessionToken;
}
export function getEventListener(mockSocket, eventName) {
    const ret = mockSocket.on.mock.calls.find(eachCall => eachCall[0] === eventName);
    if (ret) {
        const param = ret[1];
        if (param) {
            return param;
        }
    }
    throw new Error(`No event listener found for event ${eventName}`);
}
export class MockedPlayer {
    socket;
    socketToRoomMock;
    userName;
    townID;
    player;
    constructor(socket, socketToRoomMock, userName, townID, player) {
        this.socket = socket;
        this.socketToRoomMock = socketToRoomMock;
        this.userName = userName;
        this.townID = townID;
        this.player = player;
    }
    moveTo(x, y, rotation = 'front', moving = false) {
        const onMovementListener = getEventListener(this.socket, 'playerMovement');
        onMovementListener({ x, y, rotation, moving });
    }
}
export function mockPlayer(townID) {
    const socket = mockDeep();
    const userName = nanoid();
    socket.handshake.auth = { userName, townID };
    const socketToRoomMock = mock();
    socket.to.mockImplementation((room) => {
        if (townID === room) {
            return socketToRoomMock;
        }
        throw new Error(`Tried to broadcast to ${room} but this player is in ${townID}`);
    });
    return new MockedPlayer(socket, socketToRoomMock, userName, townID, undefined);
}
export function expectArraysToContainSameMembers(actual, expected) {
    expect(actual.length).toBe(expected.length);
    expected.forEach(expectedVal => expect(actual.find(actualVal => actualVal === expectedVal)).toBeDefined());
}
export function isViewingArea(interactable) {
    return 'isPlaying' in interactable;
}
export function isConversationArea(interactable) {
    return 'topic' in interactable;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL1Rlc3RVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBYSxNQUFNLG9CQUFvQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUM7QUE0QmhDLE1BQU0sVUFBVSw0QkFBNEIsQ0FBQyxNQUk1QztJQUNDLE9BQU87UUFDTCxFQUFFLEVBQUUsTUFBTSxFQUFFLGNBQWMsSUFBSSxNQUFNLEVBQUU7UUFDdEMsYUFBYSxFQUFFLEVBQUU7UUFDakIsS0FBSyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsSUFBSSxNQUFNLEVBQUU7S0FDN0MsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLFVBQVUsZUFBZTtJQUM3QixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLENBQUM7QUFDckYsQ0FBQztBQVlELE1BQU0sVUFBVSxrQkFBa0IsQ0FDaEMsV0FBbUUsRUFDbkUsU0FBYztJQUVkLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0tBQ2xDO1NBQU07UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FDOUQsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUN0QyxDQUFDO0tBQ0g7QUFDSCxDQUFDO0FBU0QsTUFBTSxVQUFVLG1CQUFtQixDQUNqQyxPQUErRCxFQUMvRCxTQUFhLEVBQ2IsVUFBVSxH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