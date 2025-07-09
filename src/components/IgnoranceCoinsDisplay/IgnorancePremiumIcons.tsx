import { Flex, Tooltip, useMediaQuery } from '@chakra-ui/react';
import React from "react";
import IgnoranceProgress from "./IgnoranceProgress";
import RandomRewardModal from "../modals/RandomRewardModal";
import { useUser } from "../../hooks";
import CoinsDisplay from "./CoinsDisplay";
import StatusProgress from "./StatusProgress";
import { Module } from "../../recoil/trailRecoilState";
import StampIcon from "../StampIcon";
import { S3_LOCKED_STAMP } from "../../utils/constants/constants";
import MediaQueriesEnum from '../../utils/enums/mediaQueries';

interface IgnoracenPremiumIconsInterface {
  ignorance: number;
  showStatus?: boolean;
  statusText?: string;
  statusPoints?: number;
  statusColor?: string;
  modules?: Module[];
  stampImage?: string;
}

const IgnorancePremiumIcons = ({ ignorance, showStatus, statusText, statusPoints, statusColor, modules, stampImage }: IgnoracenPremiumIconsInterface) => {
  const { userData } = useUser();
  const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);


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
        </Flex>
        <RandomRewardModal />
      </Flex>
    </>
  )
};
export default IgnorancePremiumIcons;
