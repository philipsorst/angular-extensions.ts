import {UrlInfo} from "./url-info";
import {HydraCollection} from "./hydra-collection";
import {HydraView} from "./hydra-view";

export function ApiPlatformRestangularConfigFactory(RestangularProvider, baseUrl)
{
    let baseUrl = UrlInfo.parse(baseUrl);

    /**
     * Make URL absolute, so Restangular can handle it properly.
     */
    function absolutizeUrl(url: string): string | null
    {
        if (null == url) {
            return url;
        }

        return baseUrl.getRoot() + url;
    }

    RestangularProvider.setBaseUrl(baseUrl);
    RestangularProvider.setSelfLinkAbsoluteUrl(true);

    /* Hydra collections support */
    RestangularProvider.addResponseInterceptor((data, operation) => {

        /* Rewrite the href so restangular can handle it */
        function setHref(data)
        {
            if (null != data && data['@id']) {
                data['href'] = absolutizeUrl(data['@id']);
                data['nodeUri'] = data['@id'];
            }
        }

        /* Populate href property for the collection */
        setHref(data);

        if ('getList' === operation) {

            if (!data.hasOwnProperty('hydra:member')) {
                return data;
            }

            let hydraCollection = new HydraCollection();
            for (let result of data['hydra:member']) {
                setHref(result);
                hydraCollection.push(result);
            }

            hydraCollection.totalItems = data['hydra:totalItems'];
            if (data.hasOwnProperty('hydra:view')) {
                let viewData = data['hydra:view'];
                let hydraView = new HydraView();
                hydraView.first = absolutizeUrl(viewData['hydra:first']);
                hydraView.next = absolutizeUrl(viewData['hydra:next']);
                hydraView.previous = absolutizeUrl(viewData['hydra:previous']);
                hydraView.last = absolutizeUrl(viewData['hydra:last']);
                hydraCollection.view = hydraView;
            }

            return hydraCollection;
        }

        return data;
    });
}
