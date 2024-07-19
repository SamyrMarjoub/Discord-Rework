import { createGlobalState } from 'react-hooks-global-state';
const { setGlobalState, useGlobalState } = createGlobalState({
    defaultCurrency: {},
    mobileselected:0,
    modalOpen:0,
    pagination:0,
    modal_open_2:0,
    userData:{},
    isServerSelected:false,
    ServerChannelsData:[],
    ChannelSelectedId:''
})
export { setGlobalState, useGlobalState }