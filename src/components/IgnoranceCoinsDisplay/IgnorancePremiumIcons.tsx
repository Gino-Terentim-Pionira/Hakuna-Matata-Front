import { Flex, useDisclosure, Tooltip, useMediaQuery } from '@chakra-ui/react';
import React, { useState, useEffect } from "react";
import IgnoranceProgress from "./IgnoranceProgress";
import RandomRewardModal from "../modals/RandomRewardModal";
import Glasses from '../../assets/icons/double-glasses.png';
import GlassesOn from '../../assets/icons/double-glasses-on.png';
import Daily from '../../assets/icons/daily_quiz.png';
import { useUser } from "../../hooks";
import horizon from '../../assets/horizon.webp';
import useIgnoranceFilter from '../../hooks/useIgnoranceFilter';
import CoinsDisplay from "./CoinsDisplay";
import NavIcon from "../NavigationComponents/NavIcon";
import { IGNORANCE_GLASS, DAILY_QUIZ, ORACLE, BLOCKED_ORACLE } from "../../utils/constants/mouseOverConstants";
import StatusProgress from "./StatusProgress";
import QuizAlertModal from "../Quiz/QuizAlertModal";
import { ALERT_QUIZ_MODAL } from "../../utils/constants/textConstants";
import DailyQuiz from "../Quiz/DailyQuiz";
import OracleIcon from "../../assets/icons/oracle/oracle_icon.webp";
import { useHistory } from 'react-router-dom';
import trailEnum from "../../utils/enums/trail";
import { TutorialModal } from "../modals/Tutorial/TutorialModal";
import TutorialServices from "../../services/TutorialServices";
import { Module } from "../../recoil/trailRecoilState";
import StampIcon from "../StampIcon";
import { S3_LOCKED_STAMP } from "../../utils/constants/constants";
import MediaQueriesEnum from '../../utils/enums/mediaQueries';

interface IgnoracenPremiumIconsInterface {
  ignorance: number;
  dontShowIgnorance?: boolean;
  showStatus?: boolean;
  trail?: trailEnum;
  statusText?: string;
  statusPoints?: number;
  statusColor?: string;
  dontShowOracle?: boolean;
  modules?: Module[];
  stampImage?: string;
}

const IgnorancePremiumIcons = ({ dontShowIgnorance, ignorance, showStatus, trail, statusText, statusPoints, statusColor, dontShowOracle, modules, stampImage }: IgnoracenPremiumIconsInterface) => {
  // const {
  // 	isOpen: premiumIsOpen,
  // 	onClose: premiumOnClose,
  // 	onOpen: premiumOnOpen,
  // 	onToggle: premiumOnToggle,
  // } = useDisclosure();
  const tutorialServices = new TutorialServices();
  const { userData } = useUser();
  const history = useHistory();
  const { isIgnoranceFilterOn, handleIgnoranceFilter } = useIgnoranceFilter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDifferentDay, setIsDifferentDay] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [onCloseTutorial, setOnCloseTutorial] = useState<VoidFunction>();
  const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

  const { isOpen: quizIsOpen,
    onClose: quizOnClose,
    onOpen: quizOnOpen,
    onToggle: quizToggle
  } = useDisclosure();

  const {
    isOpen: tutorialIsOpen,
    onClose: tutorialOnClose,
    onOpen: tutorialOnOpen,
  } = useDisclosure();

  const handleDaily = () => {
    setIsModalOpen(false);
    quizOnOpen();
  }

  const handleOracle = () => {
    handleFirstView('Oráculo', () => history.push({
      pathname: '/oracle',
      state: {
        trail
      }
    }));
  }

  const handleFirstView = (topic_name: string, action: VoidFunction) => {
    if (tutorialServices.checkFirstVisualization(topic_name)) {
      setOnCloseTutorial(() => action);
      setSelectedTopic(topic_name);
      tutorialOnOpen();
    } else {
      action();
    }
  }

  const handleTutorialClose = () => {
    tutorialOnClose();
    if (onCloseTutorial) onCloseTutorial();
    setOnCloseTutorial(undefined);
  }

  const handleIgnoranceGlasses = () => {
    handleFirstView('Óculos da ignorância', handleIgnoranceFilter);
  }

  const handleDailyQuiz = () => {
    handleFirstView('Desafio diário', () => setIsModalOpen(true));
  }

  useEffect(() => {
    const verifyDailyQuiz = () => {
      const item = localStorage.getItem("@pionira/dailyQuiz");
      if (item) {
        const currentDate = new Date();
        const storedDate = new Date(item);
        setIsDifferentDay(currentDate.toDateString() !== storedDate.toDateString());
      } else {
        setIsDifferentDay(true);
      }
    }
    verifyDailyQuiz();
  }, []);

  return (
    <>
      <Flex
        display={{base: 'none', md: "flex"}}
        flexDirection='column'
        alignItems='flex-end'
        justifyContent='space-between'
        h='85.5vh'
        marginTop='1.5rem'
      >
        {/* <Image
          src={icon_membership}
          width='5rem'
          _hover={{
            cursor: 'pointer',
            transform: 'scale(1.1)',
          }}
          transition='all 0.2s ease'
          onClick={premiumOnOpen}
        /> */}
        <Flex
          flexDirection='column'
          mt='10px'
          alignItems='flex-end'
        >
          <Flex
            flexDirection='column'
            alignItems='flex-end'
          >
            <IgnoranceProgress
              position='bottom'
              ignorance={ignorance}
            />
            {
              showStatus && <StatusProgress
                status={statusPoints || 0}
                position='bottom'
                labelText={statusText || ""}
                color={statusColor || ""}
              />
            }
            {
              modules?.length ? (
                <Tooltip
                  isDisabled={!isDesktop}
                  label='Complete módulos para ganhar carimbos no passaporte!'
                  hasArrow
                >
                  <Flex
                    marginTop='16px'
                    gap='8px'
                  >
                    {
                      modules.map((item, index) => {
                        return (
                          <StampIcon
                            key={index}
                            stampImage={item.isCompleted ? stampImage as string : S3_LOCKED_STAMP}
                          />
                        )
                      })
                    }
                  </Flex>
                </Tooltip>
              ) : null
            }
          </Flex>
          <CoinsDisplay
            coins={userData.coins}
            premiumCoins={userData.premiumCoins}
            position='bottom'
          />
          {
            !dontShowIgnorance && <NavIcon
              image={isIgnoranceFilterOn ? GlassesOn : Glasses}
              mouseOver={IGNORANCE_GLASS}
              onClick={handleIgnoranceGlasses}
              size="normal"
              isMap={false}
              position="right"
            />
          }
          {
            (!isIgnoranceFilterOn && isDifferentDay) && <NavIcon
              image={Daily}
              mouseOver={DAILY_QUIZ}
              onClick={handleDailyQuiz}
              size="normal"
              isMap={false}
              position="right"
            />
          }
          {
            !dontShowOracle && <NavIcon
              cursor={!dontShowOracle ? 'pointer' : 'not-allowed'}
              image={OracleIcon}
              mouseOver={!dontShowOracle ? ORACLE : BLOCKED_ORACLE}
              onClick={!dontShowOracle ? handleOracle : () => null}
              size="normal"
              isMap={false}
              position="right"
            />
          }
        </Flex>
        <RandomRewardModal />
        <QuizAlertModal
          modalIsOpen={isModalOpen}
          modalOnClose={() => setIsModalOpen(false)}
          title={ALERT_QUIZ_MODAL}
          image={horizon}
          confirmFunction={handleDaily}
        />
        <DailyQuiz
          closeModal={quizOnClose}
          onToggle={quizToggle}
          openModal={quizIsOpen}
        />
      </Flex>
      {/* <PremiumPassport
        isOpen={premiumIsOpen}
        onClose={premiumOnClose}
        onToggle={premiumOnToggle}
      /> */}
      <TutorialModal isOpen={tutorialIsOpen} onClose={handleTutorialClose} selectedTopic={selectedTopic} />
    </>
  )
};
export default IgnorancePremiumIcons;
