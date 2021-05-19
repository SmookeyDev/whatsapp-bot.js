from chatterbot.trainers import ListTrainer
from chatterbot import ChatBot

chatbot = ChatBot('Chat Bot', logic_adapters=["chatterbot.logic.BestMatch"])

conversa = ['oi', 'olá', 'tudo bem?', 'tudo ótimo']

trainer = ListTrainer(chatbot)
trainer.train(conversa)

def deepinteligency(smkbot):
    resposta = chatbot.get_response(smkbot.lower())
    return ('{}'.format(resposta))

handler = {'def': deepinteligency}