import { createGlobalState } from 'react-hooks-global-state';
const { setGlobalState, useGlobalState } = createGlobalState({
    defaultCurrency: {},
    mobileselected:0,
    modalOpen:0,
    pagination:0,
})
export { setGlobalState, useGlobalState }