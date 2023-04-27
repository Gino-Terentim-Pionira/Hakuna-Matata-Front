import React, { FC } from "react";
import colorPalette from "../../styles/colorPalette";
import stop from "../../assets/icons/stop.svg";
import GenericModal from "./GenericModal";

type BlockedModalProp = {
	isOpen: boolean,
    onClose: VoidFunction;
};

const BlockedModal: FC<BlockedModalProp> = ({
    isOpen,
    onClose
}) => {

	return (
		<GenericModal genericModalInfo={{
            title: "Tenha paciência, Jovem!",
            titleColor: colorPalette.inactiveButton,
            subtitle: "Esse horizonte ainda não pode se explorado, por enquanto...",
            icon: stop
        }} isOpen={isOpen} confirmFunction={onClose} loading={false} error={false} />
	);
};

export default BlockedModal;