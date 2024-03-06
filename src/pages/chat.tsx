import React, { useState, useEffect } from 'react';
import { Text, Input, Flex, Button } from '@chakra-ui/react';
import api from '../services/api';

interface IMessage {
    role: string;
    content: string
}

const Chat = () => {
    const [list, setList] = useState<IMessage[]>([
        {
            role: 'Assistant',
            content: 'Olá, no que posso ajudar?'
        }
    ]);

    const [message, setMessage] = useState('');
    const handleChange = (event) => setMessage(event.target.value);

    const sendMessage = async () => {
        setList([...list, {
            role: 'user',
            content: message
        }]);
        setMessage('');
    }

    const getAnswer = async () => {
        const threadId = localStorage.getItem("threadId");
        const response = await api.post("user/chat/sendmessage", {
            content: message,
            threadId
        });

        setList((currentList) => [
            ...currentList,
            ...response.data.map(item => ({
                role: 'Assistente',
                content: item.text.value
            }))
        ]);

        console.log(response);
        // Chamar requisição que manda a mensagem e espera o retorno do assistente. Assim que receber a resposta, atualiza o list com as mensagens novas do assistente
    }

    const getThread = async () => {
        const threadId = await api.post("user/chat");
        localStorage.setItem("threadId", threadId.data);
        // Chamar requisição que cria a thread, retorna o id e salva no localhost
    }

    useEffect(() => {
        const threadId = localStorage.getItem("threadId");
        if (!threadId) {
            getThread();
        }
	}, []);

    return (
        <>
        {
            list?.map((item) => {
                return <Text>
                    {item.role}: {item.content}
                </Text>
            })
        }
        <Flex
            width='50%'
        >
            <Input 
                value={message}
                onChange={handleChange}
                placeholder='Digite sua pergunta aqui'
                size='sm'
            />
            <Button onClick={() => {
                sendMessage();
                getAnswer();
            }}>Enviar</Button>
        </Flex>    
        </>
    )
}

export default Chat;