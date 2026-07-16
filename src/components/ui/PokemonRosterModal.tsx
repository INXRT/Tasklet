"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle } from "lucide-react";
import { createPortal } from "react-dom";
import { ScaleWrapper } from "@/components/ui/ScaleWrapper";
import { Pokemon2D } from "@/components/ui/Pokemon2D";
import { POKEMON_DATA, getPokemonLevel } from "@/lib/pokemon-data";
import { setActivePokemon } from "@/actions/pokemon";

interface PokemonRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  pokemons: any[];
  activePokemonId: string;
}

export function PokemonRosterModal({ isOpen, onClose, userId, pokemons, activePokemonId }: PokemonRosterModalProps) {
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (pokemonId: string) => {
    if (pokemonId === activePokemonId) return;
    startTransition(async () => {
      await setActivePokemon(userId, pokemonId);
      onClose();
    });
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <ScaleWrapper targetWidth={1280} targetHeight={800} padding={24}>
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                  className="relative w-full max-w-4xl glass-panel rounded-[2rem] p-8 shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                  onClick={e => e.stopPropagation()}
                >
                  <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-50"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center mb-8 relative z-10 shrink-0">
                    <h2 className="text-4xl font-serif text-white tracking-tight drop-shadow-md">My Pokémon</h2>
                    <p className="text-zinc-400 mt-2 font-medium tracking-wide">Select a companion to train and display on your dashboard.</p>
                  </div>

                  <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-8">
                      {pokemons.map((pokemon) => {
                        const meta = POKEMON_DATA[pokemon.pokemonId];
                        const level = getPokemonLevel(pokemon.xp);
                        const isActive = pokemon.id === activePokemonId;

                        return (
                          <button
                            key={pokemon.id}
                            onClick={() => handleSelect(pokemon.id)}
                            disabled={isPending}
                            className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 overflow-hidden group ${
                              isActive 
                                ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95"
                            }`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-0"></div>
                            
                            {isActive && (
                              <div className="absolute top-3 right-3 text-emerald-400 z-20">
                                <CheckCircle className="w-5 h-5 drop-shadow-md" />
                              </div>
                            )}

                            {pokemon.isShiny && (
                              <div className="absolute top-3 left-3 text-amber-400 z-20">
                                <Star className="w-5 h-5 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                              </div>
                            )}
                            
                            <div className="relative z-10 h-32 w-full flex items-center justify-center mb-4 bg-black/30 rounded-xl shadow-inner overflow-hidden">
                              <Pokemon2D speciesId={pokemon.pokemonId} mood={pokemon.mood} level={level} />
                            </div>

                            <div className="relative z-10 w-full text-left">
                              <div className="flex justify-between items-end mb-1">
                                <h3 className="text-xl font-serif text-white capitalize">{meta?.name || "Unknown"}</h3>
                                <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Lv {level}</span>
                              </div>
                              <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/10">
                                <div 
                                  className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                                  style={{ width: `${(pokemon.xp % 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>
            </ScaleWrapper>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
