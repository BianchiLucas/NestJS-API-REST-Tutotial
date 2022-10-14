import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private service: BookmarkService) { }

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.service.getBookmarks(userId);
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.service.getBookmarkById(userId, bookmarkId);
    }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
        return this.service.createBookmark(userId, dto);
    }

    @Patch(':id')
    editBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number, @Body() dto: EditBookmarkDto) {
        return this.service.editBookmarkById(userId, bookmarkId, dto);
    }

    @Delete(':id')
    deleteBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.service.deleteBookmarkById(userId, bookmarkId);
    }
}

// @Param() decorator es basicamente params de Express 
// ParseIntPipe transforma el :id (string) a number