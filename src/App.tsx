import React from 'react';
//Components
import QuestionCard from './components/QuestionCard';
//Types
import { Difficulty, fetchQuizQuestion, QuestionState } from './API';
//Styles
import { GlobalStyle, Wrapper } from './App.styles';
import Theme from './theme';
const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
	question: string;
	answer: string;
	correct: boolean;
	correctAnswer: string;
};

const App = () => {
	const [loading, setLoading] = React.useState(false);
	const [questions, setQuestions] = React.useState<QuestionState[]>([]);
	const [number, setNumber] = React.useState(0);
	const [userAnswers, setUserAnswers] = React.useState<AnswerObject[]>([]);
	const [score, setScore] = React.useState(0);
	const [gameOver, setGameOver] = React.useState(true);

	const [test, settest] = React.useState(0);

	React.useEffect(() => {
		settest(2);
		console.log(test);
	}, [test]);

	const startTrivia = async () => {
		setLoading(true);
		setGameOver(false);
		const newQuestions = await fetchQuizQuestion(
			TOTAL_QUESTIONS,
			Difficulty.EASY
		);

		setQuestions(newQuestions);
		setScore(0);
		setUserAnswers([]);
		setNumber(0);
		setLoading(false);
	};
	const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!gameOver) {
			//User Answer
			const answer = e.currentTarget.value;
			// Check answer against correct answer
			const correct = questions[number].correct_answer === answer;
			// Add score if answer is correct
			if (correct) setScore((prev) => prev + 1);
			// Save answer in the array for user answers
			const answerObject: AnswerObject = {
				question: questions[number].question,
				answer,
				correct,
				correctAnswer: questions[number].correct_answer,
			};
			setUserAnswers((prev) => [...prev, answerObject]);
		}
	};
	const nextQuestion = () => {
		const nextQuestion = number + 1;

		if (nextQuestion === TOTAL_QUESTIONS) {
			setGameOver(true);
		} else {
			setNumber(nextQuestion);
		}
	};
	
	const theme = React.useContext(Theme);
	console.log(theme);

	return (
		<>
			<GlobalStyle />
			<Wrapper>
				<Theme.Provider value="dark">
					<Theme.Consumer>
						{(theme) => <h1>Theme is : {theme}</h1>}
					</Theme.Consumer>
				</Theme.Provider>
				<h1>React Quiz</h1>
				{gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
					<button className="start" onClick={startTrivia}>
						Start
					</button>
				) : null}
				{!gameOver && <p className="score">Score: {score}</p>}
				{loading && <p>Loading Question ...</p>}
				{!loading && !gameOver && (
					<QuestionCard
						questionNumber={number + 1}
						totalQuestions={TOTAL_QUESTIONS}
						question={questions[number].question}
						answers={questions[number].answer}
						userAnswer={
							userAnswers ? userAnswers[number] : undefined
						}
						callback={checkAnswer}
					/>
				)}
				{!gameOver &&
					!loading &&
					userAnswers.length === number + 1 &&
					number !== TOTAL_QUESTIONS - 1 && (
						<button className="next" onClick={nextQuestion}>
							Next Question
						</button>
					)}
			</Wrapper>
		</>
	);
};

export default App;
