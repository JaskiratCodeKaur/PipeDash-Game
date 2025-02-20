/*   Javascript Author: Jaskirat Kaur Student ID: 000904397 Date: 31 July, 2023

		The file consist of function that creates the pipes for my game, bounce the ball, 
		stop the mottion of both ball and pipes as the ball collides with pipes,and display the scores at the end.
		It handles the whole functioning of the game.-Animation,creation , stopping animation.


*/
			/* For tracking the score of player*/
			let score = 0;
			
			/*For creating the array of pipes*/
			let pipes = [];
			
			/* pipe width*/
			const pipeWidth = 50;
			
			/*Gap between upper and lower pipe*/
			const pipeGap = 150;
			
			/* Gravity on the ball*/
			let gravity = 0.6;
			
			/*Velocity of the ball*/
			let velocity = -15;
			
			/*How much the ball need to be lifted*/
			let lift = -15;
			
			/*Ball y- coordinate*/
			let ballY = 300;
			
			/*Speed of the ball*/
			let speed = 5;
			
			/* SVG width and height for game view*/
			const svgWidth = 800;
			const svgHeight = 700;
			
			
			let lastPipeX = svgWidth;

			/*For the game running*/
			let gameRunning = true;
			
			/*For pipe moving animation*/
			let pipesMoving = true;
					
			const svgContainer = document.getElementById("game-svg");

			const ball = document.getElementById('ball');

					
			const startButton = document.getElementById("startButton");
			const playerNameInput = document.getElementById("textInput");
			const headerText = document.querySelector("h1.text-center");
			
			/*
			*This is the event listenser added to start button 
			*which display the main game onclicking the start button.
			*/

			startButton.addEventListener("click", () => {
			  const playerName = playerNameInput.value.trim();
			  if (playerName !== "") {
				// To update the header text to include the player's name
				headerText.textContent = 'Welcome to my Game, '+  playerName;

				// To hide the start screen and show the game screen
				const startScreen = document.querySelector(".start-screen");
				const gameScreen = document.querySelector(".game");
				startScreen.style.display = "none";
				gameScreen.style.display = "block";

				// To start the game loop when the button is clicked
				gameLoop();
			  }
			});
			
			
		
			/* To update the position and velocity of ball in the game.
			*checks for collisions with the boundaries of the game container and calls the function checkCollisions()
			* checkCollisions() function to detect collisions with the pipes.
			*/

			function ballUpdate() {
				if(gameRunning){
				  velocity += gravity;
				  ballY += velocity;
				  velocity *= 0.9;
				  ball.setAttribute("cy", ballY);

				  if (ballY >= 500) {
					ballY = 500;
					this.velocity = 0;
				  }

				  if (ballY < 0) {
					velocity = 0;
					
					ballY = 0;
				  }
				  checkCollisions();
				}
			  
			}
			
		
		
			/*To detect the collision of the ball with the upper and lower pipe in the game. 
			*If collision occurs, the game call the function handleCollision() for ending the game and displaying the scores.
			*/
			function checkCollisions() {
			  const ballX = parseFloat(ball.getAttribute('cx'));
			  const ballY = parseFloat(ball.getAttribute('cy'));
			  const ballRadius = parseFloat(ball.getAttribute('r'));

			  for (const pipe of pipes) {
				const upperPipeX = parseFloat(pipe.upper.getAttribute('x'));
				const upperPipeY = parseFloat(pipe.upper.getAttribute('y'));
				const upperPipeHeight = parseFloat(pipe.upper.getAttribute('height'));

				const lowerPipeX = parseFloat(pipe.lower.getAttribute('x'));
				const lowerPipeY = parseFloat(pipe.lower.getAttribute('y'));
				const lowerPipeHeight = parseFloat(pipe.lower.getAttribute('height'));

				// To check  inhe ball tersection with the upper pipe
				if (
				  ballX + ballRadius > upperPipeX &&
				  ballX - ballRadius < upperPipeX + pipeWidth &&
				  ballY - ballRadius < upperPipeY + upperPipeHeight
				) {
					// If collision is detected with the upper pipe then, calling the handleCollision() function for ending the game.
				  handleCollision();
				  return;
				}

				// To check the ball  intersection with the lower pipe
				if (
				  ballX + ballRadius > lowerPipeX &&
				  ballX - ballRadius < lowerPipeX + pipeWidth &&
				  ballY + ballRadius > lowerPipeY
				) {
					// If collision is detected  with lower pipe then, calling the handleCollision() function for ending the game.
				  handleCollision();
				  return;
				}
			  }
			}


			/*This is the function  to handle collision and stop the game
			* It displays the text game over along with scores of player and stop the animation of moving pipes.
			*/
			function handleCollision() {
			  gameRunning = false;
			  pipesMoving = false;
			
				
			  // Stop the animation of moving pipes
			  cancelAnimationFrame(movePipes);
			  
			  const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			  backgroundRect.setAttribute('x', 0);
			  backgroundRect.setAttribute('y', 0);
			  backgroundRect.setAttribute('width', svgWidth);
			  backgroundRect.setAttribute('height', svgHeight);
			  backgroundRect.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
			  svgContainer.appendChild(backgroundRect);
			 
			  //To display  the final score on the screen
			  const finalScoreText = document.createElementNS("http://www.w3.org/2000/svg", "text");
			  finalScoreText.setAttribute("x", svgWidth / 2);
			  finalScoreText.setAttribute("y", svgHeight / 2 + 60);
			  finalScoreText.setAttribute("text-anchor", "middle");
			  finalScoreText.setAttribute("font-size", "24px");
			  finalScoreText.setAttribute("fill", "white");
			  finalScoreText.textContent = 'Your Score: '+ score;
			  svgContainer.appendChild(finalScoreText);

			  // to display "Game Over" message with the final score on the screen
			  const gameOverText = document.createElementNS("http://www.w3.org/2000/svg", "text");
			  gameOverText.setAttribute("x", svgWidth / 2);
			  gameOverText.setAttribute("y", svgHeight / 2);
			  gameOverText.setAttribute("text-anchor", "middle");
			  gameOverText.setAttribute("font-size", "48px");
			  gameOverText.setAttribute("fill", "red");
			  gameOverText.textContent = "Game Over!";
			  svgContainer.appendChild(gameOverText);
			}

			/*
			*This is to lift the ball up by using the velocity and lift amount.
			*/
			function ballUp(){
			  velocity += lift;
			}
			
			
			/*
			*This is the event listener added in game to have keyboard event that controls ball movement.
			*/
			document.addEventListener('keydown', function (event) {
			  if (event.code === 'Space') {
				ballUp();
			  }
			});
			
			
			/*
			*To start the game loop of the ball 
			*/
			function gameLoop() {
			  ballUpdate();
			  requestAnimationFrame(gameLoop); 
			}
			
			
			/*
			* This  functionis to create the pair of pipes with gap in between 
			*them and the height of each gap is randomly generated.
			*/
			
			function createPipePair() {
			  const upperPipeHeight = Math.random() * 200 + 100;
			  const lowerPipeHeight = svgHeight - upperPipeHeight - pipeGap;
			  
			  
			  // for the upper pipe
			  const upperPipe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			  upperPipe.setAttribute('class', 'pipe');
			  upperPipe.setAttribute('x', lastPipeX);
			  upperPipe.setAttribute('y', 0);
			  upperPipe.setAttribute('width', pipeWidth);
			  upperPipe.setAttribute('height', upperPipeHeight);
			  svgContainer.appendChild(upperPipe);
			
			
			  // for the lower pipe
			  const lowerPipe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			  lowerPipe.setAttribute('class', 'pipe');
			  lowerPipe.setAttribute('x', lastPipeX);
			  lowerPipe.setAttribute('y', svgHeight - lowerPipeHeight);
			  lowerPipe.setAttribute('width', pipeWidth);
			  lowerPipe.setAttribute('height', lowerPipeHeight);
			  svgContainer.appendChild(lowerPipe);

			  pipes.push({ upper: upperPipe, lower: lowerPipe });
			  lastPipeX += 200; // To adjust this value to control the gap between pipe pairs
			  
			  if (gameRunning) {
				score++;
				// If game is still running, to update the score display in the header
				const scoreSpan = document.querySelector("#score span");
				scoreSpan.textContent = score;
			  }
			}
			
			
			
			/*
			*The function is for animating the movement of pipes in the game.
			*It also creates new pipes at random intervals to maintain the flow of the pipes.
			*If any pipe go off screen of SVG it also remove that one.
			*/
			function movePipes() {
			  if (pipesMoving) {
				for (const pipe of pipes) {
				// To update the x-coordinate of the upper and lower pipes to move them to the left
				  let pipeX = parseFloat(pipe.upper.getAttribute('x'));
				  pipeX -= 1.5;
				  pipe.upper.setAttribute('x', pipeX);
				  pipe.lower.setAttribute('x', pipeX);
					 
				  // If a pipe goes off the left side of the game area, remove it from the SVG container
				  if (pipeX + pipeWidth < 0) {
					pipe.upper.remove();
					pipe.lower.remove();
				  }
				}
				
				
				// to randomly generate new pipe pairs at a rate of approximately 0.02 (2%) chance per frame
				if (gameRunning && Math.random() < 0.02) {
				  createPipePair();
				}
				// to request the next frame to continue the animation
				requestAnimationFrame(movePipes);
			  }
			}

			// to request the next frame to continue the animation

			requestAnimationFrame(movePipes);