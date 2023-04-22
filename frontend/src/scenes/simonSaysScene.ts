
// You can write more code here

/* START OF COMPILED CODE */

import Phaser from "phaser";
import PushOnClick from "../components/PushOnClick";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class simonSaysScene extends Phaser.Scene {

	constructor() {
		super("simonSaysScene");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// Wkey
		const wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

		// Akey
		const akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

		// SKey
		const sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

		// DKey
		const dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

		// UpKey
		const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

		// redBackground
		this.add.image(300, 300, "redBackground");

		// border
		const border = this.add.image(300, 300, "border");
		border.scaleX = 0.07572997919;
		border.scaleY = 0.109446;

		// interactables
		const interactables = this.add.layer();

		// sectionS
		const sectionS = this.add.triangle(300, 430, 0, 128, 64, 0, 128, 128);
		sectionS.angle = -180;
		sectionS.isFilled = true;
		sectionS.fillColor = 255;
		sectionS.isStroked = true;
		sectionS.strokeColor = 0;
		sectionS.lineWidth = 5;
		interactables.add(sectionS);

		// sectionD
		const sectionD = this.add.triangle(450, 280, 0, 128, 64, 0, 128, 128);
		sectionD.angle = 90;
		sectionD.isFilled = true;
		sectionD.fillColor = 16711680;
		sectionD.isStroked = true;
		sectionD.strokeColor = 0;
		sectionD.lineWidth = 5;
		interactables.add(sectionD);

		// sectionW
		const sectionW = this.add.triangle(300, 130, 0, 128, 64, 0, 128, 128);
		sectionW.isFilled = true;
		sectionW.fillColor = 65280;
		sectionW.isStroked = true;
		sectionW.strokeColor = 0;
		sectionW.lineWidth = 5;
		interactables.add(sectionW);

		// closeButton
		const closeButton = this.add.rectangle(495, 50, 128, 128);
		closeButton.scaleX = 0.5;
		closeButton.scaleY = 0.5;
		closeButton.setOrigin(0, 0);
		closeButton.isFilled = true;
		closeButton.fillColor = 2368548;
		closeButton.isStroked = true;
		closeButton.strokeColor = 0;
		closeButton.lineWidth = 10;
		interactables.add(closeButton);

		// sectionA
		const sectionA = this.add.triangle(150, 280, 0, 128, 64, 0, 128, 128);
		sectionA.angle = -90;
		sectionA.isFilled = true;
		sectionA.fillColor = 16776960;
		sectionA.isStroked = true;
		sectionA.strokeColor = 0;
		sectionA.lineWidth = 5;
		interactables.add(sectionA);

		// ellipse_1
		const ellipse_1 = this.add.ellipse(300, 280, 128, 128);
		ellipse_1.isFilled = true;
		ellipse_1.fillColor = 0;
		ellipse_1.lineWidth = 3.5;
		interactables.add(ellipse_1);

		// timer
		const timer = this.add.text(300, 280, "", {});
		timer.setOrigin(0.5, 0.5);
		timer.text = "---";
		timer.setStyle({ "align": "center", "fontSize": "60px", "fontStyle": "bold" });
		interactables.add(timer);

		// closeX
		const closeX = this.add.text(505, 45, "", {});
		closeX.text = "X";
		closeX.setStyle({ "color": "#FF0000", "fontSize": "64px", "fontStyle": "bold", "stroke": "#000000ff", "strokeThickness":4,"shadow.stroke":true});
		interactables.add(closeX);

		// roundCounter
		const roundCounter = this.add.text(35, 505, "", {});
		roundCounter.text = "Round: #NUMBER";
		roundCounter.setStyle({ "fontSize": "54px", "stroke": "#000000", "strokeThickness":8,"shadow.stroke":true});

		// lists
		const arrows = [sectionS, sectionW, sectionA, sectionD];

		// sectionS (components)
		new PushOnClick(sectionS);

		// sectionD (components)
		new PushOnClick(sectionD);

		// sectionW (components)
		new PushOnClick(sectionW);

		// closeButton (components)
		new PushOnClick(closeButton);

		// sectionA (components)
		new PushOnClick(sectionA);

		// closeX (components)
		new PushOnClick(closeX);

		this.wkey = wkey;
		this.akey = akey;
		this.sKey = sKey;
		this.dKey = dKey;
		this.upKey = upKey;
		this.arrows = arrows;

		this.events.emit("scene-awake");
	}

	private wkey!: Phaser.Input.Keyboard.Key;
	private akey!: Phaser.Input.Keyboard.Key;
	private sKey!: Phaser.Input.Keyboard.Key;
	private dKey!: Phaser.Input.Keyboard.Key;
	private upKey!: Phaser.Input.Keyboard.Key;
	private arrows!: Phaser.GameObjects.Triangle[];

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
		this.stage.backgroundColor = "#D44A59";
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
