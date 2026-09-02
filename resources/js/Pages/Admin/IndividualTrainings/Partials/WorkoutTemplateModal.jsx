import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { 
    Sparkles, 
    Dumbbell, 
    Activity, 
    Flame, 
    HeartPulse, 
    Compass, 
    Check, 
    X, 
    ChevronRight, 
    Layers, 
    Zap,
    Trophy,
    Target,
    Timer,
    Scale,
    Footprints,
    Gauge,
    Shield,
    TrendingUp,
    RotateCcw,
    Crosshair
} from 'lucide-react';

export const WORKOUT_TEMPLATES = [
    {
        id: 'upper_body_strength',
        title: 'Upper Body (Dada, Punggung & Bahu)',
        category: 'Strength & Hypertrophy',
        icon: Dumbbell,
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        description: 'Fokus kekuatan tubuh bagian atas dengan kombinasi gerakan push & pull serta aktivasi bahu.',
        blocksCount: 3,
        blocks: [
            {
                name: 'Pemanasan & Aktivasi Bahu',
                category: 'warm_up',
                target_filled_by: 'coach',
                set_scheme: 'straight_set',
                rest_between_sets: '45s',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Band Pull-Apart / Scapular Retraction',
                        sets: 2,
                        reps: '15',
                        reps_array: ['15', '15'],
                        load: '',
                        load_unit: 'kg',
                        rest_per_set: '30s',
                        rest_per_set_array: ['30s', '30s'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Arm Circles & Shoulder Mobility',
                        sets: 2,
                        reps: '10',
                        reps_array: ['10', '10'],
                        load: '',
                        load_unit: 'kg',
                        rest_per_set: '30s',
                        rest_per_set_array: ['30s', '30s'],
                    }
                ]
            },
            {
                name: 'Latihan Inti Tubuh Atas (Main Workout)',
                category: 'strength_training',
                target_filled_by: 'coach',
                set_scheme: 'straight_set',
                rest_between_sets: '90s',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Dumbbell Bench Press / Push Up',
                        sets: 3,
                        reps: '10',
                        reps_array: ['10', '10', '10'],
                        load: '12',
                        load_array: ['10', '12', '12'],
                        load_unit: 'kg',
                        rest_per_set: '60s',
                        rest_per_set_array: ['60s', '60s', '60s'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Lat Pulldown / Bent-over Row',
                        sets: 3,
                        reps: '12',
                        reps_array: ['12', '12', '12'],
                        load: '25',
                        load_array: ['20', '25', '25'],
                        load_unit: 'kg',
                        rest_per_set: '60s',
                        rest_per_set_array: ['60s', '60s', '60s'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Dumbbell Overhead Shoulder Press',
                        sets: 3,
                        reps: '10',
                        reps_array: ['10', '10', '10'],
                        load: '8',
                        load_array: ['8', '8', '8'],
                        load_unit: 'kg',
                        rest_per_set: '60s',
                        rest_per_set_array: ['60s', '60s', '60s'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Bicep Curl & Tricep Extension Superset',
                        sets: 3,
                        reps: '12',
                        reps_array: ['12', '12', '12'],
                        load: '6',
                        load_array: ['6', '6', '6'],
                        load_unit: 'kg',
                        rest_per_set: '45s',
                        rest_per_set_array: ['45s', '45s', '45s'],
                    }
                ]
            },
            {
                name: 'Pendinginan & Peregangan Statis',
                category: 'stretching',
                target_filled_by: 'coach',
                set_scheme: 'straight_set',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Chest & Lat Static Stretch',
                        sets: 1,
                        reps: '30s',
                        reps_array: ['30s'],
                        note: 'Tahan regangan dada dan lat selama 30 detik per sisi.',
                    }
                ]
            }
        ]
    },
    {
        id: 'lower_body_strength',
        title: 'Lower Body (Kaki, Paha & Glutes)',
        category: 'Strength & Power',
        icon: Zap,
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
        description: 'Fokus kekuatan dan hipertrofi kaki (Quad, Hamstring, Glutes & Betis).',
        blocksCount: 3,
        blocks: [
            {
                name: 'Pemanasan & Mobilitas Panggul',
                category: 'warm_up',
                target_filled_by: 'coach',
                set_scheme: 'straight_set',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Hip 90/90 & Leg Swings',
                        sets: 2,
                        reps: '10',
                        reps_array: ['10', '10'],
                        load_unit: 'kg',
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Glute Bridge Activation',
                        sets: 2,
                        reps: '12',
                        reps_array: ['12', '12'],
                        load_unit: 'kg',
                    }
                ]
            },
            {
                name: 'Latihan Inti Kaki (Leg Day)',
                category: 'strength_training',
                target_filled_by: 'coach',
                set_scheme: 'straight_set',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Goblet Squat / Barbell Back Squat',
                        sets: 3,
                        reps: '10',
                        reps_array: ['10', '10', '10'],
                        load: '16',
                        load_array: ['16', '20', '20'],
                        load_unit: 'kg',
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Romanian Deadlift (Dumbbell/Barbell)',
                        sets: 3,
                        reps: '10',
                        reps_array: ['10', '10', '10'],
                        load: '20',
                        load_array: ['20', '24', '24'],
                        load_unit: 'kg',
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Walking Lunges / Bulgarian Split Squat',
                        sets: 3,
                        reps: '10',
                        reps_array: ['10', '10', '10'],
                        load: '8',
                        load_array: ['8', '8', '8'],
                        load_unit: 'kg',
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Standing Calf Raise',
                        sets: 3,
                        reps: '15',
                        reps_array: ['15', '15', '15'],
                        load: '10',
                        load_array: ['10', '10', '10'],
                        load_unit: 'kg',
                    }
                ]
            },
            {
                name: 'Pendinginan & Peregangan Kaki',
                category: 'stretching',
                target_filled_by: 'coach',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Hamstring & Quad Stretch',
                        sets: 1,
                        reps: '30s',
                        reps_array: ['30s'],
                        note: 'Peregangan paha depan, hamstring, dan betis.',
                    }
                ]
            }
        ]
    },
    {
        id: 'speed_agility_saq',
        title: 'Speed, Agility & Footwork (SAQ)',
        category: 'Athletic Conditioning',
        icon: Flame,
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        description: 'Latihan kelincahan, reaksi kaki, dan akselerasi untuk meningkatkan performa atletik.',
        blocksCount: 3,
        blocks: [
            {
                name: 'Dynamic Warm Up & Ladder Drills',
                category: 'warm_up',
                target_filled_by: 'coach',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'High Knees & Butt Kicks',
                        sets: 2,
                        reps: '20m',
                        reps_array: ['20m', '20m'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Agility Ladder - Icky Shuffle',
                        sets: 3,
                        reps: '1',
                        reps_array: ['1', '1', '1'],
                    }
                ]
            },
            {
                name: 'Main Drill (Kelincahan & Akselerasi)',
                category: 'interval',
                target_filled_by: 'coach',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Cone T-Drill / Pro Agility 5-10-5',
                        sets: 4,
                        reps: '1',
                        reps_array: ['1', '1', '1', '1'],
                        rest_per_set: '60s',
                        rest_per_set_array: ['60s', '60s', '60s', '60s'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Box Jump & Landing Mechanics',
                        sets: 3,
                        reps: '6',
                        reps_array: ['6', '6', '6'],
                        rest_per_set: '45s',
                        rest_per_set_array: ['45s', '45s', '45s'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: '10m - 20m Acceleration Sprints',
                        sets: 4,
                        reps: '1',
                        reps_array: ['1', '1', '1', '1'],
                        rest_per_set: '90s',
                        rest_per_set_array: ['90s', '90s', '90s', '90s'],
                    }
                ]
            },
            {
                name: 'Pendinginan & Breathing',
                category: 'stretching',
                target_filled_by: 'coach',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Light Jog & Full Lower Stretch',
                        sets: 1,
                        reps: '5 mins',
                        reps_array: ['5 mins'],
                    }
                ]
            }
        ]
    },
    {
        id: 'fullbody_conditioning_core',
        title: 'Full Body Conditioning & Core',
        category: 'Fat Burn & Stamina',
        icon: Activity,
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        description: 'Sirkuit latihan seluruh tubuh untuk membangun daya tahan kardio dan kekuatan core.',
        blocksCount: 3,
        blocks: [
            {
                name: 'Pemanasan & Core Activation',
                category: 'warm_up',
                target_filled_by: 'coach',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Jumping Jacks & Mountain Climbers',
                        sets: 2,
                        reps: '30s',
                        reps_array: ['30s', '30s'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Deadbug & Bird Dog',
                        sets: 2,
                        reps: '10',
                        reps_array: ['10', '10'],
                    }
                ]
            },
            {
                name: 'Sirkuit Full Body (Circuit Training)',
                category: 'strength_training',
                target_filled_by: 'coach',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Kettlebell Swings',
                        sets: 3,
                        reps: '15',
                        reps_array: ['15', '15', '15'],
                        load: '12',
                        load_array: ['12', '12', '12'],
                        load_unit: 'kg',
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Dumbbell Thrusters (Squat to Press)',
                        sets: 3,
                        reps: '10',
                        reps_array: ['10', '10', '10'],
                        load: '6',
                        load_array: ['6', '6', '6'],
                        load_unit: 'kg',
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Plank Hold with Shoulder Tap',
                        sets: 3,
                        reps: '45s',
                        reps_array: ['45s', '45s', '45s'],
                    }
                ]
            },
            {
                name: 'Pendinginan Total',
                category: 'stretching',
                target_filled_by: 'coach',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Full Body Static Stretch & Foam Roll',
                        sets: 1,
                        reps: '5 mins',
                        reps_array: ['5 mins'],
                    }
                ]
            }
        ]
    },
    {
        id: 'mobility_recovery',
        title: 'Mobility & Active Recovery',
        category: 'Recovery & Flexibility',
        icon: HeartPulse,
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        description: 'Sesi pemulihan aktif untuk meredakan kekakuan otot dan meningkatkan rentang gerak sendi.',
        blocksCount: 2,
        blocks: [
            {
                name: 'Mobilitas Sendi & Foam Rolling',
                category: 'mobility',
                target_filled_by: 'coach',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Thoracic Spine Rotation & Cat-Cow',
                        sets: 2,
                        reps: '10',
                        reps_array: ['10', '10'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Foam Rolling Major Muscles (Back, Quads, Glutes)',
                        sets: 1,
                        reps: '5 mins',
                        reps_array: ['5 mins'],
                    }
                ]
            },
            {
                name: 'Peregangan Dalam & Relaksasi',
                category: 'stretching',
                target_filled_by: 'coach',
                items: [
                    {
                        exercise_id: '',
                        exercise_name: 'Pigeon Pose (Hip Opener)',
                        sets: 2,
                        reps: '45s',
                        reps_array: ['45s', '45s'],
                    },
                    {
                        exercise_id: '',
                        exercise_name: 'Child’s Pose & Deep Diaphragmatic Breathing',
                        sets: 1,
                        reps: '3 mins',
                        reps_array: ['3 mins'],
                    }
                ]
            }
        ]
    }
];

export default function WorkoutTemplateModal({
    isOpen,
    onClose,
    onSelectTemplate,
    templates = null,
}) {
    // Merge database templates if provided, or fallback to default WORKOUT_TEMPLATES
    const availableTemplates = (templates && templates.length > 0)
        ? templates.map((t) => {
            let IconCmp = Dumbbell;
            if (t.icon === "Zap") IconCmp = Zap;
            if (t.icon === "Flame") IconCmp = Flame;
            if (t.icon === "Activity") IconCmp = Activity;
            if (t.icon === "HeartPulse") IconCmp = HeartPulse;
            if (t.icon === "Trophy") IconCmp = Trophy;
            if (t.icon === "Target") IconCmp = Target;
            if (t.icon === "Timer") IconCmp = Timer;
            if (t.icon === "Footprints") IconCmp = Footprints;
            if (t.icon === "Gauge") IconCmp = Gauge;
            if (t.icon === "Shield") IconCmp = Shield;
            if (t.icon === "TrendingUp") IconCmp = TrendingUp;
            if (t.icon === "Scale") IconCmp = Scale;
            if (t.icon === "RotateCcw") IconCmp = RotateCcw;
            if (t.icon === "Crosshair") IconCmp = Crosshair;
            if (t.icon === "Sparkles") IconCmp = Sparkles;

            return {
                id: t.id,
                title: t.title,
                category: t.category,
                description: t.description,
                icon: IconCmp,
                badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
                blocksCount: t.blocks?.length || 0,
                blocks: t.blocks || [],
            };
        })
        : WORKOUT_TEMPLATES;

    const [selectedTemplate, setSelectedTemplate] = useState(availableTemplates[0]);

    // Keep selected template updated if list changes
    React.useEffect(() => {
        if (availableTemplates && availableTemplates.length > 0 && (!selectedTemplate || !availableTemplates.some(t => t.id === selectedTemplate.id))) {
            setSelectedTemplate(availableTemplates[0]);
        }
    }, [templates]);

    if (!isOpen) return null;

    const handleApply = () => {
        if (selectedTemplate) {
            onSelectTemplate(selectedTemplate);
            onClose();
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 flex flex-col max-h-[85vh]">
                
                {/* MODAL HEADER */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-orange-500 text-white flex items-center justify-center shadow-2xs">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                                Template Sesi Latihan Siap Pakai
                            </h3>
                            <p className="text-[11px] text-slate-500">
                                Pilih template untuk mengisi seluruh rangkaian gerakan (Pemanasan, Inti, Pendinginan) secara otomatis dalam 1 klik.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* MODAL BODY (TWO COLUMN: LIST & PREVIEW) */}
                <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-100 flex-1">
                    
                    {/* LEFT LIST (5 cols) */}
                    <div className="md:col-span-5 p-3 space-y-1.5 bg-slate-50/50">
                        {availableTemplates.map((tmpl) => {
                            const IconCmp = tmpl.icon || Dumbbell;
                            const isSelected = selectedTemplate?.id === tmpl.id;
                            return (
                                <button
                                    key={tmpl.id}
                                    type="button"
                                    onClick={() => setSelectedTemplate(tmpl)}
                                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 cursor-pointer ${
                                        isSelected
                                            ? 'bg-white border-orange-400 shadow-xs ring-1 ring-orange-400/30'
                                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                                        isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        <IconCmp className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="space-y-0.5 flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9.5px] font-bold text-slate-400 uppercase">
                                                {tmpl.category}
                                            </span>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-600" />}
                                        </div>
                                        <h4 className={`text-xs font-bold truncate ${
                                            isSelected ? 'text-orange-700' : 'text-slate-800'
                                        }`}>
                                            {tmpl.title}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 block">
                                            {tmpl.blocksCount} Fase Latihan
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* RIGHT PREVIEW (7 cols) */}
                    <div className="md:col-span-7 p-4 space-y-3 bg-white">
                        {selectedTemplate ? (
                            <div className="space-y-3">
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${selectedTemplate.badgeColor}`}>
                                        {selectedTemplate.category}
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                                        {selectedTemplate.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                        {selectedTemplate.description}
                                    </p>
                                </div>

                                <div className="space-y-2 border-t border-slate-100 pt-2">
                                    <span className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                                        Rincian Fase & Gerakan:
                                    </span>
                                    
                                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                                        {selectedTemplate.blocks.map((b, bIdx) => (
                                            <div key={bIdx} className="p-2.5 bg-slate-50 rounded-md border border-slate-200/80 space-y-1 text-xs">
                                                <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                                                    <span className="w-4 h-4 rounded bg-orange-100 text-orange-700 text-[9px] flex items-center justify-center font-bold">
                                                        {bIdx + 1}
                                                    </span>
                                                    <span>{b.name}</span>
                                                </div>
                                                <ul className="pl-5 space-y-0.5 list-disc text-[11px] text-slate-600">
                                                    {b.items.map((item, itmIdx) => (
                                                        <li key={itmIdx}>
                                                            <span className="font-medium text-slate-800">{item.exercise_name}</span>
                                                            <span className="text-slate-400 ml-1">
                                                                ({item.sets} set × {item.reps} {item.load ? `@ ${item.load}kg` : ''})
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-xs">
                                Pilih salah satu template di sebelah kiri.
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleApply}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 cursor-pointer"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Terapkan Template Ini</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
