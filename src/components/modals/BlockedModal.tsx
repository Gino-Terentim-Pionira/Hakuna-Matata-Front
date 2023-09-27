import React, { FC } from "react";
import colorPalette from "../../styles/colorPalette";
import stop from "../../assets/icons/stop.svg";
import GenericModal from "./GenericModal";

type BlockedModalProp = {
	isOpen: boolean,
    onClose: VoidFunction;
    subtitle: string;
};

const BlockedModal: FC<BlockedModalProp> = ({
    isOpen,
    onClose,
    subtitle
}) => {

	return (
		<GenericModal genericModalInfo={{
            title: "Tenha paciência, Jovem!",
            titleColor: colorPalette.inactiveButton,
            subtitle,
            icon: stop
        }} isOpen={isOpen} confirmFunction={onClose} loading={false} error={false} isStaticModal={true} />
	);
};

export default BlockedModal;