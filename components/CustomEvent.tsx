"use client";
import React, {useState, useEffect} from 'react';
import { EventProps } from 'react-big-calendar';
import bin_icon from "../public/svg/trashbin.svg";
import bin_icon_white from "../public/svg/trashbin_white.svg";
import Image from 'next/image';

interface CustomEventProps extends EventProps {
    event: CustomEvent;
    cameFrom: string;
    isCommentsPublished?: boolean;
    setUserMealsList: React.Dispatch<React.SetStateAction<MealEvent[]>>;
}

interface CustomEvent {
    id: string;
    title?: string;
    meals?: Meals[];
}

const CustomEvent: React.FC<CustomEventProps> = ({ event, cameFrom, isCommentsPublished, setUserMealsList }) => {

    const [mealEvent, setMealEvent] = useState<CustomEvent>({
        id: '',
        title: '',
        meals: [],
    });


    useEffect (() => {
        if (event && event.id) {
            setMealEvent(event);
        }
    }, [event]);


    const handleEventDelete = async (mids: string) => {
        const confirmed = confirm('Are you sure?');
        if (confirmed) {
            if (!event.meals || event.meals.length === 0) return;
            if (!mids) return;

            // Extract meal IDs as a comma-separated string
            const mealIds = mids;

            const deleteMealUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/delete-meal?mids=${mealIds}`;

            try {
                const res = await fetch(deleteMealUrl, {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    throw new Error('Failed to delete meals');
                }

                // const data = await res.json();
                // console.log('Delete Response:', data);
                // location.reload();
                // update parent list with similar logic
                const mealIdList = mealIds.split(',');

                setUserMealsList(prev =>
                prev
                    .map(event => ({
                    ...event,
                    meals: event.meals?.filter(meal => !mealIdList.includes(meal.id)) || []
                    }))
                    .filter(event => event.meals && event.meals.length > 0) // keep only non-empty events
                );
                
            } catch (error) {
                console.error('Error deleting meal:', error);
            }
        }
    };

    const handleAddComment = async (mealId: number, f_comments: string) => {
   
        const comments = prompt("Add a comment (200 characters max):", f_comments);
 
        if (comments!==null){ // null is when canceled
            if ((comments && comments.length < 200) || (  comments.length === 0 )) {
                const editMealCommentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BASE_PORT}/api/update-meal?mid=${mealId}`;
                try {
                    const res = await fetch(editMealCommentUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'update_comment_only',
                            comments: comments,
                        }),
                    });

                    if (!res.ok) {
                        throw new Error('Failed to add comment');
                    }

                    const data = await res.json();
                    if (data.user_meal_updated===true){
                        // update parent list with similar logic
                        setUserMealsList(prev =>
                            prev.map(event =>
                                event.meals?.some(meal => meal.id === mealId.toString())
                                ? {
                                    ...event,
                                    meals: event.meals.map(meal =>
                                        meal.id === mealId.toString() ? { ...meal, f_comments: comments } : meal
                                    ),
                                    }
                                : event
                            )
                        );
                        // location.reload();
                    }else{
                        alert('Error: ' + data.message);
                    }

                } catch (error) {
                    console.error('Error adding comment:', error);
                }
            }else{
                alert('Comment too long');
            }
        }

        return false;
    };
 
    return (
        mealEvent && 
        <div className="custom-event">
            {cameFrom === 'private' && mealEvent.id
                ?
                <div key={`meal-${mealEvent.id}`} className="absolute right-0 p-[3px] bg-[red] rounded-[35px] leading-[12px] cursor-pointer">
                    <Image src={bin_icon_white} alt="Edit" width={17} height={17} className="trashbin-icon-all" onClick={() => handleEventDelete(mealEvent.id)} />
                </div>
                :
                <></>
             }
            <h2 className="w-100 text-center event-title">{mealEvent.title}</h2>
            {mealEvent.meals && mealEvent.meals.length > 0 && mealEvent.meals.map((meal, idx) => (
                <div key={`meal-${idx}`} className="relative border-b border-dotted border-black" >
                    <div className={"event-description w-[calc(100%-20px)] " + meal.f_category}>
                        {meal.f_title}
                        {
                            isCommentsPublished
                            ?
                            <span className={"event-comments justify-right " + (meal.f_comments ? "text-[red]" : "text-[blue]") }>
                                &nbsp;<button className="text-left" onClick={() => handleAddComment(Number(meal.id), meal.f_comments)} >*({ meal.f_comments ? meal.f_comments : '+' })</button>
                            </span>
                            :
                            <></>
                        }
                    </div>
                    {
                        cameFrom === 'private'
                        ?
                        <span className="text-[white] w-[20px] absolute right-[-7px] top-[3px] h-full" >
                            <Image src={bin_icon} alt="Edit" width={17} height={17} className="trashbin-icon" onClick={() => handleEventDelete(meal.id)} />
                        </span>
                        :
                        <></>
                    }
                </div>
            ))}
        </div>
    );
};

export default CustomEvent;