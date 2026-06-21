import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PicklistSkeletonComponent } from './components/picklist-skeleton/picklist-skeleton.component';
import { ResourcesSkeletonComponent } from '@shared/components/resources-skeleton/resources-skeleton.component';
import { CardSkeletonComponent } from '@shared/components/card-skeleton/card-skeleton.component';
import { ResourceKeletonComponent } from '@shared/components/resource-keleton/resource-keleton.component';
import { LucideAngularModule } from 'lucide-angular';

import {
    Trash2,
    Scan,
    Minimize,
    ImagePlay,
    Square,
    Plus,
    CircleQuestionMark,
    BookOpenText,
    FolderArchive,
    ListChevronsDownUp,
    Star,
    StepForward,
    ListChevronsDownUpIcon,
    MessageSquare,
    BadgeCheck,
    Settings,
    LogIn,
    Cog,
    ShoppingCart,
    Users,
    Package,
    LayoutGrid,
    Folder,
    Cpu,
    Monitor,
    Tags,
    FolderSearch
} from 'lucide-angular';

const icons = {
    Trash2,
    Scan,
    Minimize,
    ImagePlay,
    Square,
    Plus,
    CircleQuestionMark,
    BookOpenText,
    FolderArchive,
    ListChevronsDownUp,
    Star,
    StepForward,
    ListChevronsDownUpIcon,
    MessageSquare,
    BadgeCheck,
    Settings,
    LogIn,
    Cog,
    ShoppingCart,
    Users,
    Package,
    LayoutGrid,
    Folder,
    Cpu,
    Monitor,
    Tags,
    FolderSearch
};

@NgModule({
    declarations: [],
    imports: [
        LucideAngularModule.pick(icons),
        CommonModule,
        PicklistSkeletonComponent,
        ResourcesSkeletonComponent,
        CardSkeletonComponent,
        ResourceKeletonComponent
    ],
    exports:[
        LucideAngularModule,
        PicklistSkeletonComponent,
        ResourcesSkeletonComponent,
        CardSkeletonComponent,
        ResourceKeletonComponent
    ]
})
export class SharedModule { }
