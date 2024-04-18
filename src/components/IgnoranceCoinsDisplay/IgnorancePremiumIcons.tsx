import { Flex, useDisclosure } from "@chakra-ui/react";
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
import { IGNORANCE_GLASS, DAILY_QUIZ, ORACLE } from "../../utils/constants/mouseOverConstants";
import StatusProgress from "./StatusProgress";
import QuizAlertModal from "../Quiz/QuizAlertModal";
import { ALERT_QUIZ_MODAL } from "../../utils/constants/textConstants";
import DailyQuiz from "../Quiz/DailyQuiz";
import oracle from "../../assets/icons/oracle/oracle_icon.webp";
import { useHistory } from 'react-router-dom';
import trailEnum from "../../utils/enums/trail";

interface IgnoracenPremiumIconsInterface {
  ignorance: number;
  dontShowIgnorance?: boolean;
  showStatus?: boolean;
  showOracle?: boolean;
  trail?: trailEnum;
  statusText?: string;
  statusPoints?: number;
  statusColor?: string;
}

const IgnorancePremiumIcons = ({ dontShowIgnorance, ignorance, showStatus, showOracle, trail, statusText, statusPoints, statusColor }: IgnoracenPremiumIconsInterface) => {
  // const {
  // 	isOpen: premiumIsOpen,
  // 	onClose: premiumOnClose,
  // 	onOpen: premiumOnOpen,
  // 	onToggle: premiumOnToggle,
  // } = useDisclosure();
  const { userData } = useUser();
  const history = useHistory();
  const { isIgnoranceFilterOn, handleIgnoranceFilter } = useIgnoranceFilter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDifferentDay, setIsDifferentDay] = useState(false);

  const { isOpen: quizIsOpen,
    onClose: quizOnClose,
    onOpen: quizOnOpen,
    onToggle: quizToggle
  } = useDisclosure();

  const handleDaily = () => {
    setIsModalOpen(false);
    quizOnOpen();
  }

  const handleOracle = () => {
    history.push({
      pathname: '/oracle',
      state: {
        trail
      }
    })
  }

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

  useEffect(() => {
    verifyDailyQuiz();
  }, []);

  return (
    <>
      <Flex
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
          {
            !dontShowIgnorance && <Flex
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
            </Flex>
          }
          <CoinsDisplay
            value={userData.coins}
            position='bottom'
          />
          <NavIcon
            image={isIgnoranceFilterOn ? GlassesOn : Glasses}
            mouseOver={IGNORANCE_GLASS}
            onClick={handleIgnoranceFilter}
            size="normal"
            isMap={false}
            position="right"
          />
          {
            (!isIgnoranceFilterOn && isDifferentDay) && <NavIcon
              image={Daily}
              mouseOver={DAILY_QUIZ}
              onClick={() => { setIsModalOpen(true) }}
              size="normal"
              isMap={false}
              position="right"
            />
          }
          {
            showOracle && <NavIcon
              image={oracle}
              mouseOver={ORACLE}
              onClick={handleOracle}
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

    </>
  )
};

export default IgnorancePremiumIcons;
