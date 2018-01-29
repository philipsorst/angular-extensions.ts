import {UrlInfo} from "./url-info";
import {HydraCollection} from "./hydra-collection";
import {HydraView} from "./hydra-view";
import {ApiPlatformRestangularUtils} from "./api-platform-restangular-utils";

export function ApiPlatformRestangularConfigFactory(RestangularProvider, baseUrlString)
{
    let apiUrlInfo = UrlInfo.parse(baseUrlString);

    RestangularProvider.setBaseUrl(baseUrlString);
    RestangularProvider.setSelfLinkAbsoluteUrl(true);

    /* Hydra collections support */
    RestangularProvider.addResponseInterceptor((data, operation) => {

        /* Populate href property for the collection */
        ApiPlatformRestangularUtils.setHref(apiUrlInfo, data);

        if ('getList' === operation) {

            if (!data.hasOwnProperty('hydra:member')) {
                return data;
            }

            let hydraCollection = new HydraCollection();
            for (let result of data['hydra:member']) {
                ApiPlatformRestangularUtils.setHref(apiUrlInfo, result);
                hydraCollection.push(result);
            }

            hydraCollection.totalItems = data['hydra:totalItems'];
            if (data.hasOwnProperty('hydra:view')) {
                let viewData = data['hydra:view'];
                let hydraView = new HydraView();
                hydraView.first = ApiPlatformRestangularUtils.absolutizeUrl(apiUrlInfo, viewData['hydra:first']);
                hydraView.next = ApiPlatformRestangularUtils.absolutizeUrl(apiUrlInfo, viewData['hydra:next']);
                hydraView.previous = ApiPlatformRestangularUtils.absolutizeUrl(apiUrlInfo, viewData['hydra:previous']);
                hydraView.last = ApiPlatformRestangularUtils.absolutizeUrl(apiUrlInfo, viewData['hydra:last']);
                hydraCollection.view = hydraView;
            }

            return hydraCollection;
        }

        return data;
    });
}
