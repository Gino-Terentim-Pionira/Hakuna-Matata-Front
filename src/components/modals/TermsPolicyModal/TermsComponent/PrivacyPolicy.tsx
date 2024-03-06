import React from 'react';
import { Box } from '@chakra-ui/react';
import SectionTitle from './SectionTitle';
import SectionContent from './SectionContent';

const PrivacyPolicy = () => {
    return (
        <Box>
            <SectionTitle>
                1. Introdução
            </SectionTitle>
            <SectionContent>
                A Plataforma Pionira valoriza a privacidade e a segurança dos dados de nossos usuários. Esta Política de Privacidade estabelece nosso compromisso com a proteção de suas informações pessoais. Explica como coletamos, usamos, compartilhamos e protegemos as informações no contexto de sua utilização dos nossos serviços.
            </SectionContent>

            <SectionTitle>
                2. Coleta de Informações
            </SectionTitle>
            <SectionContent>
                Quando você se inscreve na Pionira, coletamos informações necessárias para o funcionamento eficaz e personalizado dos serviços oferecidos. Isso inclui, mas não se limita a:
                <br />
                <br />
                <li>
                    Dados Pessoais: nome, endereço de e-mail e data de nascimento.
                </li>
                <br />
                <li>
                    Dados de Uso: informações sobre como você interage com a plataforma, incluindo cursos acessados, progresso nas trilhas e preferências de aprendizado.
                </li>
                <br />
                <br />
                Além disso, podemos coletar informações técnicas e de log, como detalhes do navegador e endereços IP, para melhorar sua experiência e garantir a segurança da plataforma.
            </SectionContent>

            <SectionTitle>
                3. Uso das Informações
            </SectionTitle>
            <SectionContent>
                Suas informações pessoais são utilizadas para:
                <br />
                <br />
                <li>
                    Prestar e personalizar os serviços.
                </li>
                <br />
                <li>
                    Emitir certificados de conclusão.
                </li>
                <br />
                <li>
                    Oferecer suporte ao usuário.
                </li>
                <br />
                <li>
                    Enviar comunicações sobre atualizações, novos cursos e ofertas, de acordo com suas preferências de comunicação.
                </li>
                <br />
                <li>
                    Realizar análises internas para melhorar a qualidade dos serviços.
                </li>
            </SectionContent>

            <SectionTitle>
                4. Compartilhamento de Informações
            </SectionTitle>
            <SectionContent>
                Comprometemo-nos a não vender suas informações pessoais a terceiros. As informações podem ser compartilhadas apenas nas seguintes circunstâncias:
                <br />
                <br />
                <li>
                    Com prestadores de serviços terceirizados que nos auxiliam na operação da plataforma, sob acordos de confidencialidade e segurança.
                </li>
                <br />
                <li>
                    Para cumprir obrigações legais ou ordens judiciais.
                </li>
                <br />
                <li>
                    Para proteger os direitos e a segurança da Pionira, de nossos usuários e do público.
                </li>
            </SectionContent>

            <SectionTitle>
                5. Segurança das Informações
            </SectionTitle>
            <SectionContent>
                Implementamos medidas de segurança robustas, incluindo criptografia e monitoramento contínuo, para proteger suas informações contra acessos não autorizados e vazamentos.
            </SectionContent>

            <SectionTitle>
                6. Direitos do Usuário
            </SectionTitle>
            <SectionContent>
                Você tem o direito de acessar, retificar, portar ou excluir suas informações pessoais. Além disso, pode limitar o uso e compartilhamento de suas informações. Para exercer esses direitos, entre em contato conosco através do e-mail pionira@ginoterentim.com.
            </SectionContent>

            <SectionTitle>
                7. Alterações na Política de Privacidade
            </SectionTitle>
            <SectionContent>
                Nos reservamos o direito de alterar esta política periodicamente. Qualquer alteração significativa será comunicada através dos canais oficiais da plataforma e por e-mail, quando aplicável.
            </SectionContent>

            <SectionTitle>
                8. Contato
            </SectionTitle>
            <SectionContent>
                Para quaisquer dúvidas ou preocupações relacionadas à sua privacidade e aos seus dados na Plataforma Pionira, por favor, entre em contato conosco pelo e-mail: pionira@ginoterentim.com.
            </SectionContent>
        </Box>
    );
}

export default PrivacyPolicy;
