#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// ==========================================
// DATA STRUCTURES
// ==========================================
struct Deity;

typedef struct Edge {
    struct Deity* connectedDeity;
    char relationType[50];
    struct Edge* next;
} Edge;

typedef struct Deity {
    char id[15];
    char name[100];
    char district[50];
    char village[100];
    char history[2000];
    char image[1000];
    char video[500];
    char map[500];
    char links[500];
    char gurName[100];
    char travelGuide[1000];
    char devKhel[1000];
    char oracleRecords[1000];
    
    Edge* adjacencyListHead;
    struct Deity* next;
} Deity;

typedef struct Slide {
    char id[10];
    char title[200];
    char subtitle[300];
    char imageUrl[1000];
    char deityId[15];
    struct Slide* next;
} Slide;

Deity* head = NULL;
Slide* slideHead = NULL;

void addDeity(const char* id, const char* name, const char* district, const char* village, const char* history, const char* image, const char* video, const char* map, const char* links, const char* gur, const char* travel, const char* khel, const char* oracle) {
    Deity* newDeity = (Deity*)malloc(sizeof(Deity));
    strcpy(newDeity->id, id);
    strcpy(newDeity->name, name);
    strcpy(newDeity->district, district);
    strcpy(newDeity->village, village);
    strcpy(newDeity->history, history);
    strcpy(newDeity->image, image);
    strcpy(newDeity->video, video);
    strcpy(newDeity->map, map);
    strcpy(newDeity->links, links);
    strcpy(newDeity->gurName, gur);
    strcpy(newDeity->travelGuide, travel);
    strcpy(newDeity->devKhel, khel);
    strcpy(newDeity->oracleRecords, oracle);
    newDeity->adjacencyListHead = NULL;
    newDeity->next = NULL;

    if(head == NULL) {
        head = newDeity;
    } else {
        Deity* temp = head;
        while(temp->next != NULL) temp = temp->next;
        temp->next = newDeity;
    }
}

Deity* getDeityByID(const char* id) {
    Deity* curr = head;
    while(curr != NULL) {
        if(strcmp(curr->id, id) == 0) return curr;
        curr = curr->next;
    }
    return NULL;
}

void addEdge(Deity* from, Deity* to, const char* relation) {
    if(!from || !to) return;
    
    Edge* newEdge = (Edge*)malloc(sizeof(Edge));
    newEdge->connectedDeity = to;
    strcpy(newEdge->relationType, relation);
    newEdge->next = NULL;
    
    if(from->adjacencyListHead == NULL) {
        from->adjacencyListHead = newEdge;
    } else {
        Edge* curr = from->adjacencyListHead;
        while(curr->next != NULL) curr = curr->next;
        curr->next = newEdge;
    }
}

// ==========================================
// CRUD OPERATIONS
// ==========================================
void deleteDeity(const char* id) {
    Deity* curr = head;
    Deity* prev = NULL;
    while(curr != NULL) {
        if(strcmp(curr->id, id) == 0) {
            if(prev == NULL) head = curr->next;
            else prev->next = curr->next;
            free(curr);
            printf("-> Record %s purged successfully.\n", id);
            return;
        }
        prev = curr;
        curr = curr->next;
    }
    printf("-> Error: Record %s not found.\n", id);
}

void saveDatabase() {
    FILE* file = fopen("kuldev_db.tsv", "w");
    if(!file) return;
    Deity* curr = head;
    while(curr != NULL) {
        fprintf(file, "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n", 
                curr->id, curr->name, curr->district, curr->village, 
                curr->history, curr->image, curr->video, curr->map, curr->links,
                curr->gurName, curr->travelGuide, curr->devKhel, curr->oracleRecords);
        curr = curr->next;
    }
    fclose(file);
    printf("-> Master TSV database updated successfully.\n");
}

void loadSlides() {
    FILE* file = fopen("hero_slides.tsv", "r");
    if(!file) return;
    char line[4096];
    while(fgets(line, sizeof(line), file)) {
        char id[10]="", title[200]="", sub[300]="", img[1000]="", did[15]="";
        int len = strlen(line); if(len > 0 && line[len-1] == '\n') line[len-1] = '\0';
        char* cursor = line;
        #define GET_FIELD_S(dest) if (cursor) { char* end = strchr(cursor, '\t'); if (end) { *end = '\0'; strcpy(dest, cursor); cursor = end + 1; } else { strcpy(dest, cursor); cursor = NULL; } }
        GET_FIELD_S(id); GET_FIELD_S(title); GET_FIELD_S(sub); GET_FIELD_S(img); GET_FIELD_S(did);
        if(strlen(id)>0) {
            Slide* ns = (Slide*)malloc(sizeof(Slide));
            strcpy(ns->id, id); strcpy(ns->title, title); strcpy(ns->subtitle, sub);
            strcpy(ns->imageUrl, img); strcpy(ns->deityId, did);
            ns->next = slideHead; slideHead = ns;
        }
    }
    fclose(file);
}

// ==========================================
// FILE I/O
// ==========================================
void loadDatabase() {
    FILE* file = fopen("kuldev_db.tsv", "r");
    if(!file) {
        printf("Error: kuldev_db.tsv not found!\n");
        return;
    }
    char line[8192];
    while(fgets(line, sizeof(line), file)) {
        char id[15], name[100], dist[50], vill[100], hist[2000], img[1000], vid[500], map[500], lnk[500], gur[100], trv[1000], khl[1000], orc[1000];
        
        int len = strlen(line);
        if(len > 0 && line[len-1] == '\n') line[len-1] = '\0';
        char* cursor = line;
        
        #define GET_FIELD(dest) \
            if (cursor == NULL || *cursor == '\0') { \
                dest[0] = '\0'; \
            } else { \
                char* end = strchr(cursor, '\t'); \
                if (end) { \
                    *end = '\0'; \
                    strcpy(dest, cursor); \
                    cursor = end + 1; \
                } else { \
                    strcpy(dest, cursor); \
                    cursor = NULL; \
                } \
            }

        GET_FIELD(id); GET_FIELD(name); GET_FIELD(dist); GET_FIELD(vill); GET_FIELD(hist);
        GET_FIELD(img); GET_FIELD(vid); GET_FIELD(map); GET_FIELD(lnk);
        GET_FIELD(gur); GET_FIELD(trv); GET_FIELD(khl); GET_FIELD(orc);

        if(strlen(id) > 0) addDeity(id, name, dist, vill, hist, img, vid, map, lnk, gur, trv, khl, orc);
    }
    fclose(file);
    printf("Successfully loaded nodes from kuldev_db.tsv\n");
}

void loadLineages() {
    FILE* file = fopen("lineages.tsv", "r");
    if(!file) return;
    
    char line[256];
    int count = 0;
    while(fgets(line, sizeof(line), file)) {
        int len = strlen(line);
        if(len > 0 && line[len-1] == '\n') line[len-1] = '\0';
        
        char id1[15], id2[15], relation[50];
        char* token = strtok(line, "\t");
        if(token) strcpy(id1, token);
        
        token = strtok(NULL, "\t");
        if(token) strcpy(id2, token);
        
        token = strtok(NULL, "\t");
        if(token) strcpy(relation, token);
        
        Deity* d1 = getDeityByID(id1);
        Deity* d2 = getDeityByID(id2);
        
        if(d1 && d2) {
            addEdge(d1, d2, relation);
            addEdge(d2, d1, relation);
            count++;
        }
    }
    fclose(file);
    printf("Successfully built Adjacency List Graph with %d edges.\n", count * 2);
}

// ==========================================
// JSON STRING ESCAPE HELPER
// ==========================================
void writeJsonStr(FILE* out, const char* s) {
    for(; *s; s++) {
        switch(*s) {
            case '"':  fputs("\\\"", out); break;
            case '\\': fputs("\\\\", out); break;
            case '\n': fputs("\\n", out); break;
            case '\r': break;
            case '\t': fputs(" ", out); break;
            default:   if((unsigned char)*s >= 32) fputc(*s, out);
        }
    }
}

// ==========================================
// STATIC SITE GENERATOR (SSR in C)
// ==========================================
void generateWebsite() {
    FILE* tpl = fopen("../index_template.html", "r");
    FILE* out = fopen("../index.html", "w");
    
    if(!tpl || !out) return;

    char line[8192];
    int idx = 0;
    while(fgets(line, sizeof(line), tpl)) {
        if(strstr(line, "<!-- SSR_HERO_START -->")) {
            Slide* s = slideHead;
            int sIdx = 0;
            while(s != NULL) {
                fprintf(out, "            <div class=\"hero-slide %s\" style=\"background-image: linear-gradient(to bottom, rgba(0,0,0,0.3), var(--bg-primary)), url('%s')\">\n", 
                        (sIdx == 0 ? "active" : ""), s->imageUrl);
                fprintf(out, "                <div class=\"absolute inset-0 flex items-center justify-center text-center p-6\">\n");
                fprintf(out, "                    <div class=\"max-w-4xl space-y-6\">\n");
                fprintf(out, "                        <h2 class=\"text-5xl md:text-7xl font-bold serif text-white leading-tight\">%s</h2>\n", s->title);
                fprintf(out, "                        <p class=\"text-white/60 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto\">%s</p>\n", s->subtitle);
                fprintf(out, "                        <div class=\"pt-8 flex justify-center gap-4\">\n");
                fprintf(out, "                            <button onclick=\"viewDetail('%s')\" class=\"bg-amber-500 text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-amber-400 transition-all\">Explore Deity</button>\n", s->deityId);
                fprintf(out, "                        </div>\n");
                fprintf(out, "                    </div>\n");
                fprintf(out, "                </div>\n");
                fprintf(out, "            </div>\n");
                s = s->next; sIdx++;
            }
        }
        else if(strstr(line, "<!-- SSR_HERO_DOTS -->")) {
            Slide* s = slideHead;
            int sIdx = 0;
            while(s != NULL) {
                fprintf(out, "            <div class=\"dot %s\" onclick=\"goToSlide(%d)\"></div>\n", (sIdx == 0 ? "active" : ""), sIdx);
                s = s->next; sIdx++;
            }
        }
        else if(strstr(line, "<!-- SSR_DEITIES_START -->")) {
            Deity* curr = head;
            while(curr != NULL) {
                int hasImage = (strlen(curr->image) > 0 && strcmp(curr->image, "temple.png") != 0);
                
                fprintf(out, "<div class=\"glass-card rounded-2xl overflow-hidden flex flex-col group relative cursor-pointer animate-fade-in-up\" style=\"animation-delay: %dms;\" onclick=\"viewDetail('%s')\">\n", (idx % 10) * 50, curr->id);
                fprintf(out, "    <div class=\"h-56 bg-charcoal-900 flex items-center justify-center overflow-hidden relative deity-image-wrapper\">\n");
                if (hasImage) {
                    fprintf(out, "        <img src=\"%s\" class=\"w-full h-full object-cover transition-transform duration-700 group-hover:scale-110\">\n", curr->image);
                } else {
                    fprintf(out, "        <div class=\"w-full h-full bg-gradient-to-br from-charcoal-800 to-black flex items-center justify-center\"><span class=\"text-6xl text-white/5\">🔱</span></div>\n");
                }
                fprintf(out, "        <div class=\"absolute inset-0 bg-amber-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500\"></div>\n");
                fprintf(out, "        <div class=\"absolute top-4 left-4 z-10\">\n");
                fprintf(out, "            <span class=\"text-[9px] font-bold text-amber-900 bg-amber-400 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg\">%s</span>\n", curr->district);
                fprintf(out, "        </div>\n");
                fprintf(out, "    </div>\n");
                
                fprintf(out, "    <div class=\"p-6 flex-1 flex flex-col relative z-10 -mt-6\">\n");
                fprintf(out, "        <div class=\"bg-charcoal-800 border border-white/5 p-4 rounded-xl flex-1 flex flex-col shadow-xl\">\n");
                fprintf(out, "            <div class=\"flex justify-between items-center mb-3\">\n");
                fprintf(out, "                <span class=\"text-[10px] font-mono text-amber-500/60 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20\">ID: %s</span>\n", curr->id);
                fprintf(out, "                <div class=\"flex gap-2\">\n");
                if (strlen(curr->map) > 0) fprintf(out, "                    <a href=\"%s\" target=\"_blank\" class=\"text-white/40 hover:text-amber-400 transition-colors\"><i class=\"fas fa-map-marker-alt\"></i></a>\n", curr->map);
                if (strlen(curr->video) > 0) fprintf(out, "                    <a href=\"%s\" target=\"_blank\" class=\"text-white/40 hover:text-red-500 transition-colors\"><i class=\"fab fa-youtube\"></i></a>\n", curr->video);
                fprintf(out, "                </div>\n");
                fprintf(out, "            </div>\n");
                fprintf(out, "            <h3 class=\"text-xl font-bold serif text-white mb-1 leading-tight group-hover:text-amber-400 transition-colors\">%s</h3>\n", curr->name);
                fprintf(out, "            <p class=\"text-[10px] font-medium text-white/50 uppercase tracking-widest mb-4 flex items-center gap-1.5\"><i class=\"fas fa-location-dot text-amber-600\"></i> %s</p>\n", curr->village);
                fprintf(out, "            <p class=\"text-xs text-white/60 line-clamp-3 leading-relaxed font-light mt-auto border-t border-white/5 pt-4\">%s</p>\n", curr->history);
                fprintf(out, "        </div>\n");
                fprintf(out, "    </div>\n");
                fprintf(out, "</div>\n");
                
                curr = curr->next;
                idx++;
            }
        }
        else if(strstr(line, "SSR_DEITIES_JSON_START")) {
            fprintf(out, "        const initialDeities = [\n");
            Deity* curr = head;
            int first = 1;
            while(curr != NULL) {
                if(!first) fprintf(out, ",\n");
                fprintf(out, "        {");
                fprintf(out, "\"id\":\""); writeJsonStr(out, curr->id); fprintf(out, "\"");
                fprintf(out, ",\"name\":\""); writeJsonStr(out, curr->name); fprintf(out, "\"");
                fprintf(out, ",\"district\":\""); writeJsonStr(out, curr->district); fprintf(out, "\"");
                fprintf(out, ",\"village\":\""); writeJsonStr(out, curr->village); fprintf(out, "\"");
                fprintf(out, ",\"history\":\""); writeJsonStr(out, curr->history); fprintf(out, "\"");
                fprintf(out, ",\"image\":\""); writeJsonStr(out, curr->image); fprintf(out, "\"");
                fprintf(out, ",\"video\":\""); writeJsonStr(out, curr->video); fprintf(out, "\"");
                fprintf(out, ",\"map\":\""); writeJsonStr(out, curr->map); fprintf(out, "\"");
                fprintf(out, ",\"links\":\""); writeJsonStr(out, curr->links); fprintf(out, "\"");
                fprintf(out, ",\"gurName\":\""); writeJsonStr(out, curr->gurName); fprintf(out, "\"");
                fprintf(out, ",\"travelGuide\":\""); writeJsonStr(out, curr->travelGuide); fprintf(out, "\"");
                fprintf(out, ",\"devKhel\":\""); writeJsonStr(out, curr->devKhel); fprintf(out, "\"");
                fprintf(out, ",\"oracleRecords\":\""); writeJsonStr(out, curr->oracleRecords); fprintf(out, "\"");
                fprintf(out, "}");
                first = 0;
                curr = curr->next;
            }
            fprintf(out, "\n        ];\n");
            while(fgets(line, sizeof(line), tpl)) {
                if(strstr(line, "SSR_DEITIES_JSON_END")) break;
            }
        }
        else {
            fputs(line, out);
        }
    }
    fclose(tpl);
    fclose(out);
}

void generateFamilyGraph() {
    FILE* tpl = fopen("../family_template.html", "r");
    FILE* out = fopen("../family.html", "w");
    
    if(!tpl || !out) return;

    char line[4096];
    while(fgets(line, sizeof(line), tpl)) {
        fputs(line, out);
        
        if(strstr(line, "<!-- SSR_GRAPH_START -->")) {
            Deity* curr = head;
            while(curr != NULL) {
                if(curr->adjacencyListHead != NULL) {
                    fprintf(out, "<div class=\"node-card p-6 rounded-2xl\">\n");
                    fprintf(out, "    <div class=\"flex items-center gap-4\">\n");
                    fprintf(out, "        <div class=\"w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl text-amber-500\">\n");
                    fprintf(out, "            <i class=\"fas fa-om\"></i>\n");
                    fprintf(out, "        </div>\n");
                    fprintf(out, "        <div>\n");
                    fprintf(out, "            <h3 class=\"text-xl font-bold serif text-white\">%s</h3>\n", curr->name);
                    fprintf(out, "            <span class=\"text-[10px] uppercase tracking-widest text-white/50\">ID: %s &nbsp;|&nbsp; %s District</span>\n", curr->id, curr->district);
                    fprintf(out, "        </div>\n");
                    fprintf(out, "    </div>\n");
                    
                    fprintf(out, "    <div class=\"mt-4 ml-6\">\n");
                    
                    Edge* e = curr->adjacencyListHead;
                    while(e != NULL) {
                        fprintf(out, "        <div class=\"edge-link flex items-center gap-3\">\n");
                        fprintf(out, "            <span class=\"text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20\">%s</span>\n", e->relationType);
                        fprintf(out, "            <span class=\"text-white/80 font-medium text-sm\">%s <span class=\"text-white/30 text-xs\">(%s)</span></span>\n", e->connectedDeity->name, e->connectedDeity->id);
                        fprintf(out, "        </div>\n");
                        e = e->next;
                    }
                    
                    fprintf(out, "    </div>\n");
                    fprintf(out, "</div>\n");
                }
                curr = curr->next;
            }
        }
    }
    fclose(tpl);
    fclose(out);
}

// ==========================================
// ADMIN CONSOLE DASHBOARD
// ==========================================
void clearBuffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF) { }
}

void consoleDashboard() {
    int choice;
    while(1) {
        printf("\n==================================================\n");
        printf("🔱 KUL-DEV PRO: Console Admin Dashboard\n");
        printf("==================================================\n");
        printf("1. [+] Add Deity Record\n");
        printf("2. [O] View Top Records\n");
        printf("3. [*] Update Deity Name\n");
        printf("4. [-] Delete Deity Record\n");
        printf("5. [@] GENERATE STATIC WEBSITE & SAVE\n");
        printf("6. [X] Exit\n");
        printf("==================================================\n");
        printf("Enter choice (1-6): ");
        if(scanf("%d", &choice) != 1) {
            clearBuffer();
            continue;
        }
        clearBuffer();

        if(choice == 1) {
            char id[15], name[100], district[50], village[100], history[2000];
            printf("Enter ID (e.g. NEW01): "); fgets(id, 15, stdin); id[strcspn(id, "\n")] = 0;
            printf("Enter Name: "); fgets(name, 100, stdin); name[strcspn(name, "\n")] = 0;
            printf("Enter District: "); fgets(district, 50, stdin); district[strcspn(district, "\n")] = 0;
            printf("Enter Village: "); fgets(village, 100, stdin); village[strcspn(village, "\n")] = 0;
            printf("Enter History: "); fgets(history, 2000, stdin); history[strcspn(history, "\n")] = 0;
            addDeity(id, name, district, village, history, "temple.png", "", "", "", "", "", "", "");
            printf("-> Deity %s added successfully to Linked List.\n", name);
        } 
        else if(choice == 2) {
            Deity* curr = head;
            int count = 0;
            printf("\n--- ACTIVE RECORDS IN LINKED LIST ---\n");
            while(curr != NULL && count < 15) {
                printf("[%s] %s | %s | %s\n", curr->id, curr->name, curr->district, curr->village);
                curr = curr->next;
                count++;
            }
            if(curr != NULL) printf("... and %d more.\n", 180 - count);
        }
        else if(choice == 3) {
            char id[15], newName[100];
            printf("Enter ID to update: "); fgets(id, 15, stdin); id[strcspn(id, "\n")] = 0;
            Deity* d = getDeityByID(id);
            if(d) {
                printf("Current Name: %s\n", d->name);
                printf("Enter New Name: "); fgets(newName, 100, stdin); newName[strcspn(newName, "\n")] = 0;
                strcpy(d->name, newName);
                printf("-> Record %s updated.\n", id);
            } else {
                printf("-> Error: Record %s not found.\n", id);
            }
        }
        else if(choice == 4) {
            char id[15];
            printf("Enter ID to delete: "); fgets(id, 15, stdin); id[strcspn(id, "\n")] = 0;
            deleteDeity(id);
        }
        else if(choice == 5) {
            saveDatabase();
            generateWebsite();
            generateFamilyGraph();
            printf("-> Frontend HTML successfully regenerated via Server-Side Rendering!\n");
        }
        else if(choice == 6) {
            printf("Exiting Dashboard...\n");
            break;
        }
    }
}

int main() {
    printf("==================================================\n");
    printf("HIM-GATHA Static Site Generator (C Language)\n");
    printf("==================================================\n");
    loadDatabase();
    loadSlides();
    loadLineages();
    generateWebsite();
    generateFamilyGraph();
    printf("Site and lineages mapped flawlessly.\n");
    return 0;
}
