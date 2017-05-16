var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Vector = (function (_super) {
    __extends(Vector, _super);
    function Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Vector.prototype.flipX = function () {
        this.x *= -1;
    };
    Vector.prototype.flipY = function () {
        this.y *= -1;
    };
    return Vector;
}(Point));
var Side;
(function (Side) {
    Side[Side["None"] = 0] = "None";
    Side[Side["Left"] = 1] = "Left";
    Side[Side["Top"] = 2] = "Top";
    Side[Side["Right"] = 3] = "Right";
    Side[Side["Bottom"] = 4] = "Bottom";
})(Side || (Side = {}));
var Rect = (function () {
    function Rect(left, top, right, bottom) {
        this.topLeft = new Point(left, top);
        this.bottomRight = new Point(right, bottom);
    }
    Rect.prototype.clone = function () {
        return new Rect(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
    };
    Rect.prototype.add = function (point) {
        this.topLeft.x += point.x;
        this.topLeft.y += point.y;
        this.bottomRight.x += point.x;
        this.bottomRight.y += point.y;
    };
    Rect.prototype.moveTo = function (rect) {
        this.topLeft.x = rect.topLeft.x;
        this.topLeft.y = rect.topLeft.y;
        this.bottomRight.x = rect.bottomRight.x;
        this.bottomRight.y = rect.bottomRight.y;
    };
    Rect.prototype.moveCenterXTo = function (centerX) {
        var left = centerX - this.width() / 2;
        var right = left + this.width();
        this.topLeft.x = left;
        this.bottomRight.x = right;
    };
    Rect.prototype.moveBottomTo = function (bottom) {
        this.topLeft.y = bottom - this.height();
        this.bottomRight.y = bottom;
    };
    Rect.prototype.width = function () {
        return this.bottomRight.x - this.topLeft.x;
    };
    Rect.prototype.height = function () {
        return this.bottomRight.y - this.topLeft.y;
    };
    Rect.prototype.centerX = function () {
        return (this.bottomRight.x + this.topLeft.x) / 2;
    };
    Rect.prototype.centerY = function () {
        return (this.bottomRight.y + this.topLeft.y) / 2;
    };
    Rect.prototype.moveLeft = function (step) {
        this.topLeft.x -= step;
        this.bottomRight.x -= step;
    };
    Rect.prototype.moveRight = function (step) {
        this.topLeft.x += step;
        this.bottomRight.x += step;
    };
    Rect.prototype.checkCollision = function (anotherRect) {
        var w = (this.width() + anotherRect.width()) / 2;
        var h = (this.height() + anotherRect.height()) / 2;
        var dx = this.centerX() - anotherRect.centerX();
        var dy = this.centerY() - anotherRect.centerY();
        if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
            var hx = h * dx;
            var wy = w * dy;
            if (Math.abs(hx) < Math.abs(wy)) {
                return dy > 0 ? Side.Top : Side.Bottom;
            }
            else {
                return dx > 0 ? Side.Left : Side.Right;
            }
        }
        else {
            return Side.None;
        }
    };
    return Rect;
}());
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(sprite, left, top, right, bottom) {
        var _this = this;
        bottom = bottom || sprite.offsetTop + sprite.offsetHeight;
        right = right || sprite.offsetLeft + sprite.offsetWidth;
        top = top || sprite.offsetTop;
        left = left || sprite.offsetLeft;
        _this = _super.call(this, left, top, right, bottom) || this;
        _this.sprite = sprite;
        _this.isVisible = true;
        return _this;
    }
    Sprite.prototype.moveTo = function (rect) {
        _super.prototype.moveTo.call(this, rect);
        this.sprite.style.left = this.topLeft.x + 'px';
        this.sprite.style.top = this.topLeft.y + 'px';
    };
    Sprite.prototype.hide = function () {
        this.sprite.style.display = 'none';
        this.isVisible = false;
    };
    Sprite.prototype.show = function () {
        this.sprite.style.display = 'block';
        this.isVisible = true;
    };
    Sprite.prototype.checkCollision = function (anotherRect) {
        if (!this.isVisible) {
            return Side.None;
        }
        return _super.prototype.checkCollision.call(this, anotherRect);
    };
    return Sprite;
}(Rect));
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(sprite, dir) {
        var _this = this;
        var radius = parseInt(getComputedStyle(sprite)['border-top-left-radius']);
        _this = _super.call(this, sprite, sprite.offsetLeft, sprite.offsetTop, sprite.offsetLeft + 2 * radius, sprite.offsetTop + 2 * radius) || this;
        _this.sprite = sprite;
        _this.radius = radius;
        _this.velocity = 4;
        _this.dir = dir;
        return _this;
    }
    Ball.prototype.calculateNewPosition = function () {
        var newPosition = this.clone();
        newPosition.add(this.dir);
        return newPosition;
    };
    Ball.prototype.bounceHorizontal = function () {
        this.dir.flipY();
    };
    Ball.prototype.bounceVertical = function () {
        this.dir.flipX();
    };
    Ball.prototype.bounceWithAngle = function (angle) {
        angle = angle * (Math.PI / 180);
        this.dir.x = Math.cos(angle) * this.velocity;
        this.dir.y = -Math.sin(angle) * this.velocity;
    };
    return Ball;
}(Sprite));
var Paddle = (function (_super) {
    __extends(Paddle, _super);
    function Paddle(sprite, maxRight) {
        var _this = _super.call(this, sprite) || this;
        _this.maxRight = maxRight;
        return _this;
    }
    Paddle.prototype.moveLeft = function (step) {
        var newPosition = this.clone();
        newPosition.moveLeft(step);
        if (newPosition.topLeft.x >= 0) {
            this.moveTo(newPosition);
        }
    };
    Paddle.prototype.moveRight = function (step) {
        var newPosition = this.clone();
        newPosition.moveRight(step);
        if (newPosition.bottomRight.x <= this.maxRight) {
            this.moveTo(newPosition);
        }
    };
    Paddle.prototype.calculateHitAngle = function (ballX, ballRadius) {
        var hitSpot = ballX - this.topLeft.x;
        var maxPaddle = this.width() + ballRadius;
        var minPaddle = -ballRadius;
        var paddleRange = maxPaddle - minPaddle;
        var minAngle = 160;
        var maxAngle = 20;
        var angleRange = maxAngle - minAngle;
        return ((hitSpot * angleRange) / paddleRange) + minAngle;
    };
    return Paddle;
}(Sprite));
var GameState;
(function (GameState) {
    GameState[GameState["Running"] = 0] = "Running";
    GameState[GameState["GameOver"] = 1] = "GameOver";
})(GameState || (GameState = {}));
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["LEFT"] = 37] = "LEFT";
    KeyCode[KeyCode["RIGHT"] = 39] = "RIGHT";
})(KeyCode || (KeyCode = {}));
var Game = (function () {
    function Game(ballElement, paddle, bricks, boardElement, livesLabel, scoreLabel, newGameBtn) {
        var _this = this;
        this.livesLabel = livesLabel;
        this.scoreLabel = scoreLabel;
        this.newGameBtn = newGameBtn;
        this.loopInterval = 10;
        this.bricks = [];
        this.keyMap = {};
        this.gameState = GameState.Running;
        this.paddle = new Paddle(paddle, boardElement.offsetWidth);
        this.ball = new Ball(ballElement, new Vector(3, -3));
        for (var i = 0; i < bricks.length; i++) {
            this.bricks.push(new Sprite(bricks[i]));
        }
        this.createWalls(this.ball.radius, boardElement.offsetWidth, boardElement.offsetHeight);
        this.newGame();
        this.newGameBtn.addEventListener('click', function () { return _this.newGame(); });
    }
    Game.prototype.createWalls = function (radius, maxX, maxY) {
        this.wallLeft = new Rect(-radius, -radius, 0, maxY + radius);
        this.wallTop = new Rect(-radius, -radius, maxX + radius, 0);
        this.wallRight = new Rect(maxX, -radius, maxX + radius, maxY + radius);
        this.wallBottom = new Rect(-radius, maxY, maxX + radius, maxY + radius);
    };
    Game.prototype.newGame = function () {
        this.newGameBtn.style.display = 'none';
        this.score = 0;
        this.livesLeft = 3;
        this.livesLabel.innerText = '' + this.livesLeft;
        this.ball.show();
        this.ball.bounceWithAngle(60);
        var ballPosition = this.ball.clone();
        ballPosition.moveCenterXTo(this.paddle.centerX());
        ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
        this.ball.moveTo(ballPosition);
        this.gameState = GameState.Running;
        for (var i = 0; i < this.bricks.length; i++) {
            this.bricks[i].isVisible = true;
            this.bricks[i].sprite.style.display = 'block';
        }
    };
    Game.prototype.lostLive = function () {
        if (--this.livesLeft) {
            this.ball.bounceWithAngle(60);
            var ballPosition = this.ball.clone();
            ballPosition.moveCenterXTo(this.paddle.centerX());
            ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
            this.ball.moveTo(ballPosition);
        }
        else {
            this.gameState = GameState.GameOver;
            this.ball.hide();
            this.newGameBtn.style.display = 'block';
        }
        this.livesLabel.innerText = '' + this.livesLeft;
    };
    Game.prototype.run = function () {
        var _this = this;
        document.addEventListener('keyup', function (e) { return _this.keyMap[e.keyCode] = false; });
        document.addEventListener('keydown', function (e) { return _this.keyMap[e.keyCode] = true; });
        setInterval(function () {
            if (_this.gameState !== GameState.Running) {
                return;
            }
            var newBallPosition = _this.ball.calculateNewPosition();
            if (_this.keyMap[KeyCode.LEFT]) {
                _this.paddle.moveLeft(5);
            }
            else if (_this.keyMap[KeyCode.RIGHT]) {
                _this.paddle.moveRight(5);
            }
            if (_this.wallBottom.checkCollision(newBallPosition)) {
                _this.lostLive();
                return;
            }
            if (_this.wallLeft.checkCollision(newBallPosition) || _this.wallRight.checkCollision(newBallPosition)) {
                _this.ball.bounceVertical();
            }
            if (_this.wallTop.checkCollision(newBallPosition)) {
                _this.ball.bounceHorizontal();
            }
            for (var _i = 0, _a = _this.bricks; _i < _a.length; _i++) {
                var brick = _a[_i];
                var wasHit = false;
                switch (brick.checkCollision(newBallPosition)) {
                    case (Side.Left):
                    case (Side.Right):
                        _this.ball.bounceVertical();
                        wasHit = true;
                        break;
                    case (Side.Top):
                    case (Side.Bottom):
                        _this.ball.bounceHorizontal();
                        wasHit = true;
                }
                if (wasHit) {
                    brick.hide();
                    _this.score += 20;
                    _this.scoreLabel.innerText = '' + _this.score;
                    break;
                }
            }
            if (_this.paddle.checkCollision(newBallPosition)) {
                _this.ball.bounceWithAngle(_this.paddle.calculateHitAngle(_this.ball.centerX(), _this.ball.radius));
            }
            _this.ball.moveTo(_this.ball.calculateNewPosition());
        }, this.loopInterval);
    };
    return Game;
}());
var game = new Game(document.getElementsByClassName("ball")[0], document.getElementsByClassName("paddle")[0], document.getElementsByClassName("brick"), document.getElementsByClassName("container")[0], document.getElementById("lives"), document.getElementById("score"), document.getElementById("newGame"));
game.run();
