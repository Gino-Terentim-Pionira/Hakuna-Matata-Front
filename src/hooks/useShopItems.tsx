import { SetStateAction } from "react";
import { useRecoilState } from "recoil"
import { shopItemsState } from "../recoil/shopItemsRecoil";
import shopService from "../services/ShopService";
import { CertificateService, IShopCertificate } from "../services/CertificateService";
import certificateIcon from "../assets/icons/certificate/certificate.svg";
import { certificatesState } from "../recoil/certificatesRecoil";
import { oraclePackageState } from "../recoil/oraclePackagesRecoil";
import { OracleServices } from "../services/OracleServices";

export const useShopItems = () => {
    const [shopItemsData, setShopItemsData] = useRecoilState(shopItemsState);
    const [certificatesItemData, setCertificatesItemData] = useRecoilState(certificatesState);
    const [oraclePackagesItemData, setOraclePackagesItemData] = useRecoilState(oraclePackageState);

    const getNewShopItems = async () => {
        try {
            const _userId: SetStateAction<string> | null = sessionStorage.getItem(
                '@pionira/userId',
            );

            const res = await shopService.getShopItems(_userId as string);
            const shopItems = res.data.map((item: { _id: string, name: string, description: string, image: string, type: string, value: number }) => ({
                title: item.name,
                description: item.description,
                image: item.image,
                type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
                price: String(item.value),
                itemType: item.type,
                id: item._id
            }));

            setShopItemsData(shopItems)
        } catch (error) {
            setShopItemsData([])
        }
    }

    const getNewCertificateItems = async () => {
        try {
            const _userId: SetStateAction<string> | null = sessionStorage.getItem(
                '@pionira/userId',
            );

            const certificateService = new CertificateService();

            const res = await certificateService.listShopCertificates(_userId as string)
            if (res.length) {
                const certificates = res.map((item: IShopCertificate) => ({
                    title: item.name,
                    description: item.description,
                    image: certificateIcon,
                    type: "Certificado",
                    price: String(item.price),
                    itemType: 'certificate',
                    id: item.id
                }));
                setCertificatesItemData(certificates)
            } else {
                setCertificatesItemData([])
            }
        } catch (error) {
            setCertificatesItemData([]);
        }
    }

    const getNewOraclePackagesItem = async () => {
        try {
            const oracleService = new OracleServices();

            const res = await oracleService.getAllPackages()
            if (res.length) {
                const packages = res.map((item: { id: string, title: string; description: string; image: string; price: number; }) => ({
                    title: item.title,
                    description: item.description,
                    image: item.image,
                    type: "Perguntas Oraculo",
                    price: String(item.price),
                    itemType: 'oracle',
                    id: item.id
                }));
                setOraclePackagesItemData(packages)
            } else {
                setOraclePackagesItemData([])
            }
        } catch (error) {
            setOraclePackagesItemData([]);
        }
    }

    return {
        shopItemsData,
        getNewShopItems,
        getNewCertificateItems,
        certificatesItemData,
        oraclePackagesItemData,
        getNewOraclePackagesItem
    }
}

export default useShopItems;
