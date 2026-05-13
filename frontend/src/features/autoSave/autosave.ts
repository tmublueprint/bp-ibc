import { useDispatch, useSelector } from "react-redux";
import { SetSaved } from "../siteStatus/siteStatus.slices"
import { useEffect, useRef } from "react";
import { selectSaveStatus } from "../siteStatus/siteStatus.selectors";
import { saveAllPagesToDatabase } from "../../services/draftSaveService";

export function AutoSave(){
    const saveStatus = useSelector(selectSaveStatus)
    const dispatch = useDispatch();
    
    const autosaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() =>{
        if (saveStatus === "unsaved"){
            // ensure only one call after user finishes editing
            if(autosaveTimeout.current !== null){
                clearTimeout(autosaveTimeout.current);
            }

            autosaveTimeout.current = setTimeout(async () => {
                try {
                    await saveAllPagesToDatabase();
                } catch (err) {
                    console.error('[Autosave] DB save failed:', err);
                }
                dispatch(SetSaved());
            }, 30000)
            
        }

        // clean up existing timeouts
        return () => {
            if (autosaveTimeout.current !== null) {
                clearTimeout(autosaveTimeout.current);
            }
        };
    }, [dispatch, saveStatus])

    
    return null;
}