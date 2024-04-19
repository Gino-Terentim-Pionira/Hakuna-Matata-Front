import api from './api';

export type PackageType = {
	package_name: string,
	price: string,
	messages: string,
	type: string,
	description: string,
	image: string
}

export class OracleServices {

	private createURL = (rec: string) => (`oracle/${rec}`)

	getAllPackges = async () => {
		const response = await api.get(this.createURL('packages'))

		const packageData = response.data.map((item: PackageType) => ({
			title: item.package_name,
			price: item.price,
			messages: item.messages,
			type: item.type,
			description: item.description,
			image: item.image
		}));

		return packageData;
	};
}
