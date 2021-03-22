/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import { Alert, Container, Form, Button } from 'react-bootstrap';

import io from 'socket.io-client';

import useForm from './hooks/useForm';

let socket = undefined;
const connection_url = 'http://localhost:3030'; // process.env.REACT_APP_SOCKET_API;

const App = () => {
	const [text, setText] = useForm('text');
	const [messages, setMessages] = useForm('messages', []);
	const [showAlert, setShowAlert] = useState(false);
	const broadcastButton = useRef(null);

	useEffect(() => {
		socket = io(connection_url, { transport: ['websocket'] });


		socket.on('on-text-change', (data) => {
			setMessages((prev) => [...prev, data]);

			if (showAlert) setShowAlert(false);
			if (data.from === socket.id) setText('');
			else setShowAlert(true);
		});
	}, []);

	const onSubmit = (e) => {
		/**
		 * Note: it would be great if you use different notations 
		 * for emitting to server from client
		 * and emitting from server to client
		 */

		if (!text) return;
		socket.emit('onTextChange', {
			text,
			from: socket.id
		});
	};

	const buttonTriggers = ['Enter'];
	const keyPressed = (e) => {
		if (buttonTriggers.indexOf(e.key) >= 0)
			e.preventDefault();

		if (e.key === 'Enter')
			broadcastButton.current.click();
	}

	return (
		<Container className='w-25' fluid>
			{
				showAlert
					? <Alert variant={'success'} dismissible onClose={() => setShowAlert(false)}>Hey, You got a new Message !!</Alert>
					: <></>
			}

			<Form.Group controlId="formBasicEmail">
				<Form.Control placeholder="Enter text" value={text} onKeyDown={(e) => keyPressed(e)} onChange={(e) => setText(e.target.value)} />
			</Form.Group>

			<ul>{messages.map((m, ind) => <li key={ind}>{m.text}</li>)}</ul>

			<Button ref={broadcastButton} onClick={onSubmit} variant="primary">Broadcast</Button>
		</Container>
	);
}

export default App;