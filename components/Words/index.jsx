
import { deepExtractObjectStrapi } from '@utils';

import _ from 'lodash'

const AnyWord = ({ results = [] }) => {

    const rawVips =  results?.map(item => item.item);
    const vips = deepExtractObjectStrapi(rawVips);

    console.log(vips)


    return (
        <div>
            hi
        </div>
    )
}

export default AnyWord;