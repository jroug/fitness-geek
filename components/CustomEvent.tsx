"use client";
import React, {useState, useEffect} from 'react';
import { EventProps } from 'react-big-calendar';

 

interface CustomEventProps extends EventProps {
    event: CustomEvent;
    cameFrom: string;
    isCommentsPublished?: boolean;
}

interface CustomEvent {
    id: string;
    title?: string;
    meals?: Meals[];
}

const CustomEvent: React.FC<CustomEventProps> = ({ event, cameFrom, isCommentsPublished }) => {

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


    const handleEventDelete = async () => {
        const confirmed = confirm('Are you sure?');
        if (confirmed) {
            if (!event.meals || event.meals.length === 0) return;

            // Extract meal IDs as a comma-separated string
            const mealIds = event.meals.map(meal => meal.id).join(',');

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
                setMealEvent({
                    id: '',
                    title: 'Deleted',
                    meals: [],
                });
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
                        // update the state with the cahange in comment
                        setMealEvent(prev => ({
                            ...prev,
                            meals: (prev.meals ?? []).map(meal =>
                                meal.id === mealId.toString()
                                    ? { ...meal, f_comments: comments }
                                    : meal
                            ),
                        }));
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
        <div className="custom-event">
            {cameFrom === 'private' && mealEvent.id
                ?
                <div key={`meal-${mealEvent.id}`} className="absolute right-0 p-[4px] bg-[red] rounded-[35px] leading-[12px]">
                    <button className="block mt-[-2px]" onClick={handleEventDelete}>x</button>
                </div>
                :
                <></>
             }
            <h2 className="w-100 text-center event-title">{mealEvent.title}</h2>
            {mealEvent.meals && mealEvent.meals.length > 0 && mealEvent.meals.map((meal, idx) => (
                <div key={`meal-${idx}`} >
                    <div className={"event-description " + meal.f_category}>
                        {meal.f_title}
                        {
                            isCommentsPublished
                            ?
                            <span className={"event-comments " + (meal.f_comments ? "text-[red]" : "text-[blue]") }>
                                &nbsp;<button className="text-left" onClick={() => handleAddComment(Number(meal.id), meal.f_comments)} >*({ meal.f_comments ? meal.f_comments : '+' })</button>
                            </span>
                            :
                            <></>
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomEvent;