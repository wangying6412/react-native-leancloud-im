
import Immutable from 'immutable';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const mockStore = configureStore([thunk]);

export const mockFind = jest.fn(()=>Promise.resolve({
    find : jest.fn()
}));
export const mockCreateConversation = jest.fn(()=>Promise.resolve());
export const mockGetConversation = jest.fn(()=>Promise.resolve());
export const store = mockStore(
    Immutable.fromJS({
        config : {
            ownerId : 1,
            appId : 'aaa',
            appKey : 'bbb'
        },
    })
    .set('imClient',{
        getQuery : jest.fn(()=>({ find : mockFind  })),
        createConversation : mockCreateConversation,
        getConversation : mockGetConversation,
    })
);
