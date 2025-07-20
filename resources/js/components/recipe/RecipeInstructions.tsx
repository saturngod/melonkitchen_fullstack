import { RecipeInstruction } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from '@/components/ui/table';

interface RecipeInstructionsProps {
    instructions: RecipeInstruction[];
}

export default function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
    if (!instructions || instructions.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-muted rounded-lg p-8 border">
                    <svg className="mx-auto h-16 w-16 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-xl font-semibold mb-2">No Instructions Available</p>
                    <p className="text-muted-foreground">This recipe doesn't have any cooking instructions yet.</p>
                </div>
            </div>
        );
    }

    const sortedInstructions = [...instructions].sort((a, b) => a.step_number - b.step_number);

    return (
        <div className="space-y-6">
            <Table>
                <TableBody>
                    {sortedInstructions.map((instruction) => (
                        <TableRow key={instruction.id} className="border-b">
                            {/* Step Number */}


                            {/* Instruction Content */}
                            <TableCell className="align-top py-6">
                                <div className="space-y-4">
                                    {/* Instruction Text */}
                                    <div className="text-base leading-relaxed">
                                        {instruction.step_number} . {instruction.instruction}
                                    </div>

                                    {/* Step Image (if available) */}
                                    {instruction.image_url && (
                                        <div className="mt-4">
                                            <img
                                                src={instruction.image_url}
                                                alt={`Step ${instruction.step_number} visual guide`}
                                                className="w-full max-w-lg h-64 object-cover rounded-lg border shadow-sm"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}