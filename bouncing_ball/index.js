let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    Sprite = PIXI.Sprite;
let app = new Application({width: 800, height: 1200});

document.body.appendChild(app.view);

loader
    .add("images/ball.png")
    .add("images/plus.png")
    .add("images/minus.png")
    .load(setup);

let ball, plus, minus;

function setup() {
    speed = 10;
    direction = 1;

    ball = Sprite.fromImage("images/ball.png");
    console.log(ball.height);
    ball.y = 240
    ball.x = 400;
    ball.anchor.set(0.5);

    ball.vy = speed * direction;
    direction *= -1;

    app.stage.addChild(ball);

    plus = Sprite.fromImage("images/plus.png");
    plus.scale.set(0.5, 0.5);
    plus.y = 500;
    plus.x = 3;
    plus.interactive = true;
    plus.buttonMode = true;
    app.stage.addChild(plus);

    plus.on('pointerdown', () => {
        speed += 10;
        ball.vy = speed * direction;
    });

    minus = Sprite.fromImage("images/minus.png");
    minus.scale.set(0.5, 0.5);
    minus.y = 700;
    minus.x = 3;
    minus.interactive = true;
    minus.buttonMode = true;
    app.stage.addChild(minus);

    minus.on('pointerdown', () => {
        speed -= 10;
        ball.vy = speed * direction;
    });
    
    state = move;

    app.ticker.add(delta => loop(delta));

}

function loop(delta) {
    state(delta);
}

function move(delta) {
    ball.y += ball.vy;

    let ballHitsBorder = contain(ball, {x: 28, y: 10, width: 800, height: 1200});

    if (ballHitsBorder === "top" || ballHitsBorder === "bottom") {
        ball.vy *= -1;
    }

    if (speed !== 0) {
        ball.rotation += 0.05 * delta;
    }

    /*if (ballHitsBorder === "top") {
        speed += 10;
    }

    if (ballHitsBorder === "bottom") {
        speed -= 10;
    }*/
}

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