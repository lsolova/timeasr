import ReactDOMServer from 'react-dom/server';

import { should } from 'chai';
should();

export function checkRendered(rendererObject, expected, props) {
    const renderedObject = new rendererObject(props).render();
    ReactDOMServer.renderToStaticMarkup(renderedObject).should.equal(expected);
}
