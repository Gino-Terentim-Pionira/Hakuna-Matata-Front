import { useRecoilState } from "recoil";
import { ownedCertificatesState } from "../recoil/ownedCertificateRecoil";
import { SetStateAction } from "react";
import { CertificateService } from "../services/CertificateService";
import { OwnedItemInfoType } from "../components/modals/InventoryModal/InventoryModal";
import certificateIcon from "../assets/icons/certificate/certificate.svg";
import { ownedItemsState } from "../recoil/ownedItemRecoil";
import ShopService from "../services/ShopService";

export const useOwnedItems = () => {
    const [ownedItemsData, setOwnedItemsData] = useRecoilState(ownedItemsState);
    const [ownedCertificateItemData, setOwnedCertificateItemData] = useRecoilState(ownedCertificatesState);

    const getNewOwnedItems = async () => {
        try {
            const _userId: SetStateAction<string> | null = sessionStorage.getItem(
                '@pionira/userId',
            );

            const res = await ShopService.getOwnedItems(_userId as string);
            const ownedItems: OwnedItemInfoType[] = res.map((item) => ({
                title: item.name,
                description: item.description,
                image: item.image,
                price: String(item.value),
                type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
                itemType: item.type,
                id: item._id,
                id_link: item.id_link
            }));

            setOwnedItemsData(ownedItems)
        } catch (error) {
            setOwnedItemsData([]);
        }
    }

    const getNewOwnedCertificateItems = async () => {
        try {
            const _userId: SetStateAction<string> | null = sessionStorage.getItem(
                '@pionira/userId',
            );

            const certificateService = new CertificateService();
            const res = await certificateService.listOwnedCertificates(_userId as string);

            const certificates: OwnedItemInfoType[] = res.map((item) => ({
                title: item.certificate_name,
                description: item.description,
                image: certificateIcon,
                type: "Certificado",
                itemType: 'certificate',
                id: item._id,
                backgroundImage: item.image,
                first_name: item.first_name,
                last_name: item.last_name,
                content: item.content,
                hash: item.hash,
                issue_date: item.issue_date
            }));

            setOwnedCertificateItemData(certificates);
        } catch (error) {
            setOwnedCertificateItemData([]);
        }
    }

    return {
        ownedItemsData,
        getNewOwnedItems,
        ownedCertificateItemData,
        getNewOwnedCertificateItems
    }
}
