import {UrlInfo} from "./url-info";

export class ApiPlatformRestangularUtils
{
    public static absolutizeUrl(apiUrlInfo: UrlInfo, relativePath: string)
    {
        if (null == relativePath) {
            return relativePath;
        }

        return apiUrlInfo.getRoot() + relativePath;
    }

    public static setHref(apiUrlInfo: UrlInfo, data)
    {
        if (null != data && data['@id']) {
            data['href'] = ApiPlatformRestangularUtils.absolutizeUrl(apiUrlInfo, data['@id']);
            data['nodeUri'] = data['@id'];
        }
    }
}
