import React from "react";
import {
    Lightbulb,
    AlertTriangle,
    CheckCircle2,
    Info,
    Droplets,
    Zap,
    Activity,
    HeartPulse,
} from "lucide-react";

export default function SmartInsights({ test, player, benchmarks }) {
    if (!test) return null;

    const insights = [];
    const isMale =
        player?.gender === "male" || player?.gender === "L" || !player?.gender;

    const bmi = parseFloat(test.bmi);
    if (bmi) {
        if (bmi < 18.5) {
            insights.push({
                type: "warning",
                icon: Activity,
                title: "Underweight (BMI)",
                desc: "BMI is below normal. Caloric surplus and hypertrophy training needed to increase muscle mass.",
            });
        } else if (bmi >= 18.5 && bmi < 25) {
            insights.push({
                type: "info",
                icon: CheckCircle2,
                title: "Proportional BMI",
                desc: "Weight to height ratio is within ideal and healthy limits.",
            });
        } else if (bmi >= 25 && bmi < 30) {
            insights.push({
                type: "warning",
                icon: Activity,
                title: "Overweight (BMI)",
                desc: "High BMI. Ensure this weight comes from muscle mass (normal for athletes), not fat accumulation.",
            });
        } else if (bmi >= 30) {
            insights.push({
                type: "danger",
                icon: AlertTriangle,
                title: "Obesity Indication (BMI)",
                desc: "Very high BMI level. Immediate diet adjustment and caloric deficit program required.",
            });
        }
    }

    const bf = parseFloat(test.body_fat_percentage);
    if (bf) {
        const bfRef = isMale
            ? benchmarks?.body_fat?.male
            : benchmarks?.body_fat?.female;
        if (bfRef) {
            if (bf >= bfRef.obese?.min) {
                insights.push({
                    type: "danger",
                    icon: HeartPulse,
                    title: "Very High Fat",
                    desc: "Risk of burdening knee/ankle joints and drastically reducing agility.",
                });
            } else if (
                bf >= bfRef.acceptable?.min &&
                bf <= bfRef.acceptable?.max
            ) {
                insights.push({
                    type: "warning",
                    icon: HeartPulse,
                    title: "Average Fat Level",
                    desc: "Normal for non-athletes, but needs to be reduced by 3-5% to reach competitive soccer level.",
                });
            } else if (bf >= bfRef.fitness?.min && bf <= bfRef.athlete?.max) {
                insights.push({
                    type: "success",
                    icon: CheckCircle2,
                    title: "Ideal Athlete Body Fat",
                    desc: "Optimal muscle and fat composition. Power-to-weight ratio is at peak condition.",
                });
            } else if (bf <= bfRef.essential?.max) {
                insights.push({
                    type: "info",
                    icon: Info,
                    title: "Essential Fat",
                    desc: "Very low fat percentage. Beware of immune system decline or hormonal disruption if maintained for too long.",
                });
            }
        }
    }

    const tbw = parseFloat(test.total_body_water);
    if (tbw) {
        const minTbw = isMale ? 50 : 45;
        if (tbw < minTbw) {
            insights.push({
                type: "danger",
                icon: Droplets,
                title: "Clinical Dehydration",
                desc: `Total body water (${tbw}%) is lacking. Highly prone to muscle cramps. Increase fluid and electrolyte intake.`,
            });
        } else if (tbw >= minTbw && tbw <= 65) {
            insights.push({
                type: "success",
                icon: Droplets,
                title: "Optimal Hydration",
                desc: "Muscle cells are well hydrated, strongly supporting flexibility and endurance during matches.",
            });
        } else {
            insights.push({
                type: "info",
                icon: Droplets,
                title: "High Hydration",
                desc: "Total body water is quite high. Generally indicates large muscle mass because muscles store a lot of water.",
            });
        }
    }

    const visc = parseFloat(test.visceral_fat);
    if (visc) {
        if (visc < 10) {
            insights.push({
                type: "info",
                icon: CheckCircle2,
                title: "Safe Organ Fat",
                desc: `Visceral fat at Level ${visc} is very healthy. Internal organs (heart/lungs) are free from bad fat accumulation.`,
            });
        } else if (visc >= 10 && visc < 15) {
            insights.push({
                type: "warning",
                icon: HeartPulse,
                title: "Elevated Visceral Fat",
                desc: "Organ fat accumulation starting. Limit simple sugars/fried foods and increase cardio intensity.",
            });
        } else if (visc >= 15) {
            insights.push({
                type: "danger",
                icon: AlertTriangle,
                title: "Dangerous Visceral Fat",
                desc: "Organ fat level in red zone. This will severely hamper VO2Max capacity and player stamina.",
            });
        }
    }

    const actualAge = parseFloat(test.age) || parseFloat(player.age);
    const metAge = parseFloat(test.metabolic_age);
    if (actualAge && metAge) {
        if (metAge > actualAge + 2) {
            insights.push({
                type: "warning",
                icon: Zap,
                title: "Metabolic Decline",
                desc: `Cellular age (${metAge} yrs) detected older than actual age. Improve rest patterns, nutrition, and reduce stress.`,
            });
        } else if (metAge < actualAge) {
            insights.push({
                type: "success",
                icon: Zap,
                title: "Prime Metabolism",
                desc: `Excellent! Biological cell age (${metAge} yrs) is younger than calendar age. Physical recovery will be very fast.`,
            });
        } else {
            insights.push({
                type: "info",
                icon: CheckCircle2,
                title: "Stable Metabolism",
                desc: "Cellular age matches chronological age. Muscle regeneration function runs normally for this age.",
            });
        }
    }

    const pa = parseFloat(test.phase_angle);
    if (pa) {
        if (pa < 5.5) {
            insights.push({
                type: "danger",
                icon: Zap,
                title: "Overtraining Indication",
                desc: "Phase Angle is very low. Cell membrane damaged/inflamed. Mandatory full recovery for 48-72 hours.",
            });
        } else if (pa >= 5.5 && pa < 7.0) {
            insights.push({
                type: "info",
                icon: Activity,
                title: "Normal Cell Integrity",
                desc: "Health condition and muscle cell endurance are within reasonable limits.",
            });
        } else if (pa >= 7.0) {
            insights.push({
                type: "success",
                icon: CheckCircle2,
                title: "Very Strong Cellular",
                desc: "High phase angle. Body cells are very fit and ready for maximum intensity training loads.",
            });
        }
    }

    if (insights.length === 0) {
        insights.push({
            type: "info",
            icon: Lightbulb,
            title: "No Conclusions Yet",
            desc: "Please complete the body composition form to get an automatic health summary.",
        });
    }

    const getStyles = (type) => {
        switch (type) {
            case "danger":
                return {
                    bg: "bg-red-50 ",
                    border: "border-red-100 ",
                    iconBg: "bg-red-100 ",
                    iconColor: "text-red-600 ",
                    titleColor: "text-red-900 ",
                };
            case "warning":
                return {
                    bg: "bg-amber-50 ",
                    border: "border-amber-100 ",
                    iconBg: "bg-amber-100 ",
                    iconColor: "text-amber-600 ",
                    titleColor: "text-amber-900 ",
                };
            case "success":
                return {
                    bg: "bg-emerald-50 ",
                    border: "border-emerald-100 ",
                    iconBg: "bg-emerald-100 ",
                    iconColor: "text-emerald-600 ",
                    titleColor: "text-emerald-900 ",
                };
            case "info":
            default:
                return {
                    bg: "bg-zinc-50 ",
                    border: "border-zinc-200 ",
                    iconBg: "bg-zinc-200 ",
                    iconColor: "text-zinc-600 ",
                    titleColor: "text-zinc-900 ",
                };
        }
    };

    return (
        <div className="bg-white  border border-zinc-200  rounded-xl flex flex-col h-full shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-5 border-b border-zinc-200  flex items-center justify-between bg-zinc-50/50  transition-colors">
                <div className="space-y-1">
                    <h3 className="text-base font-semibold tracking-tight text-zinc-950  flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        {"Conclusions & Recommendations"}
                    </h3>
                    <p className="text-xs text-zinc-500  font-semibold">
                        Summary of player's physical status from the latest test
                        data.
                    </p>
                </div>
            </div>

            <div className="p-2 flex-1 space-y-3 overflow-y-auto max-h-[800px] custom-scrollbar">
                {insights.map((insight, idx) => {
                    const style = getStyles(insight.type);
                    const Icon = insight.icon;
                    return (
                        <div
                            key={idx}
                            className={`p-4 rounded-xl border ${style.bg} ${style.border} flex items-start gap-3.5 transition-colors`}
                        >
                            <div
                                className={`p-2 rounded-lg ${style.iconBg} shrink-0 transition-colors`}
                            >
                                <Icon
                                    className={`w-4 h-4 ${style.iconColor}`}
                                />
                            </div>
                            <div>
                                <h4
                                    className={`text-sm font-bold tracking-tight mb-1 ${style.titleColor}`}
                                >
                                    {insight.title}
                                </h4>
                                <p className="text-xs text-zinc-600  leading-relaxed font-semibold">
                                    {insight.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
