let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    Sprite = PIXI.Sprite;
    Graphics = PIXI.Graphics;
let app = new Application({width: 800, height: 1200});
app.renderer.backgroundColor = 0xF6F8FA;
let gu = new GameUtilities();

document.body.appendChild(app.view);

loader
    .add("images/ball.png")
    .add("images/plus.png")
    .add("images/minus.png")
    .load(setup);

//declaration of the variables    
let ball, plus, minus, speed, direction, shadow;

function setup() {
    speed = 10;
    direction = 1;

    //intialization of the shadow
    shadow = new Graphics();
    shadow.beginFill(0x000000);
    shadow.drawEllipse(0, 0, 200, 80);
    shadow.endFill();
    shadow.alpha = 0.1;
    shadow.x = 400;
    shadow.y = 1172;
    shadow._filters = [new PIXI.filters.BlurFilter(10)];
    app.stage.addChild(shadow);

    //intialization of the ball
    ball = Sprite.fromImage("images/ball.png");
    console.log(ball.height);
    ball.y = 240
    ball.x = 400;
    ball.anchor.set(0.5);
    ball.vy = speed * direction;
    direction *= -1;
    app.stage.addChild(ball);

    distanceBetweenSprites();

    //intialization of the plus button
    plus = Sprite.fromImage("images/plus.png");
    plus.scale.set(0.5, 0.5);
    plus.y = 500;
    plus.x = 3;
    plus.interactive = true;
    plus.buttonMode = true;
    app.stage.addChild(plus);

    //adding functionality to the plus button
    plus.on('pointerdown', () => {
        speed += 10;
        if (speed <= 0) {
            ball.vy = 0;
        } else {
            ball.vy = speed * direction;
        }
    });

    //intialization of the minus button
    minus = Sprite.fromImage("images/minus.png");
    minus.scale.set(0.5, 0.5);
    minus.y = 700;
    minus.x = 3;
    minus.interactive = true;
    minus.buttonMode = true;
    app.stage.addChild(minus);

    //adding functionality to the minus button
    minus.on('pointerdown', () => {
        if (speed <= 0) {
            speed = 0;
        } else {
            speed -= 10;
            ball.vy = speed * direction;
        }
    });
    
    state = move;

    app.ticker.add(delta => loop(delta));
    app.ticker.add(delta => shadowGrow());
    app.ticker.add(delta => velocityChange());

}

function loop(delta) {
    state(delta);
}

//function to handle the movements
function move(delta) {
    ball.y += ball.vy;

    let ballHitsBorder = contain(ball, {x: 28, y: 0, width: 800, height: 1200});

    if (ballHitsBorder === "top" || ballHitsBorder === "bottom") {
        //ball.vy *= -1;
        ball.vy = velocityChange();
    }

    if (speed > 0) {
        ball.rotation += 0.002 * speed * delta;
    } else if (speed <= 0) {
        ball.vy = 0;
    }

    if(ballHitsBorder === "bottom") {
        ball.vy *= 1;
    }

    if(ballHitsBorder === "top") {
        ball.vy *= -1;
    }
}

//function to make sure the ball is not going out of the stage
function contain(sprite, container) {
    let collision = undefined;
      
      if (sprite.y - sprite.height / 2  < container.y) {
        sprite.y = container.y + sprite.height / 2;
        collision = "top";
      }
      
      if (sprite.y + sprite.height / 2 > container.height) {
        sprite.y = container.height - sprite.height / 2;
        collision = "bottom";
      }

      return collision;

}

//function to handle the growth of the shadow and its fading effect
function shadowGrow() {
    shadow.alpha = 1 - (distanceBetweenSprites() / 1300);
    shadow.scale.set(1.0 * distanceBetweenSprites() / 800, 1.0);
}

//function to handle the change of the velocity
function velocityChange() {
    return (speed * (distanceBetweenSprites() / 1000)) * direction;
}

//function to calculate the distance between the shadow and the ball
function distanceBetweenSprites() {
    return gu.distance(ball, shadow);
}